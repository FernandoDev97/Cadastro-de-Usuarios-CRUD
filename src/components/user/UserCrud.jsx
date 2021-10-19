import React, {Component} from "react";
import axios from 'axios';
import Main from "../template/Main";

const headerProps = {
    icon: 'users',
    title: 'Usuários',
    subtitle: 'Cadastro de usuários: Incluir, Listar, Alterar e Excluir'
}

const baseUrl = 'http://localhost:3001/users'
const inicialState = {
    user: {name: '', surname: '',  email: '', birthDate: '' },
    list: []
}

export default class UserCrud extends Component {
    
    state = {...inicialState}

    componentWillMount() {
        axios(baseUrl).then(resp => {
            this.setState({list: resp.data})
        })
    }

    clear() {
        this.setState({user: inicialState.user})
    }

    save() {
        const user = this.state.user
        const method = user.id ? 'put' : 'post'
        const url = user.id ? `${baseUrl}/${user.id}` : baseUrl
        axios[method](url, user)
            .then(resp => {
                const list = this.getUpdateList(resp.data)
                this.setState({user: inicialState.user, list})
            })
    }
    
    getUpdateList(user, add = true) {
        const list = this.state.list.filter(u => u.id !== user.id)
        if (add) list.unshift(user)
        return list
    }

    updateField(event) {
        const user = { ...this.state.user }
        user[event.target.name] = event.target.value
        this.setState({user})
    }

    renderForm() {
        return (
            <div className="form">
                <div className="row">
                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label htmlFor="">Nome:</label>
                            <input type="text" className = "form-control" name="name"
                             value = {this.state.user.name} 
                             onChange = {e => this.updateField(e)} 
                             placeholder="Digite o nome..."/>
                        </div>  
                    </div>

                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label htmlFor="">Sobrenome:</label>
                            <input type="text" className = "form-control" name="surname"
                             value = {this.state.user.surname} 
                             onChange = {e => this.updateField(e)} 
                             placeholder="Digite o sobrenome..."/>
                        </div>  
                    </div>

                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label htmlFor="">Email:</label>
                            <input type="email" className = "form-control" name="email"
                             value = {this.state.user.email} 
                             onChange = {e => this.updateField(e)} 
                             placeholder="Digite o E-mail"/>
                        </div>  
                    </div>

                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label htmlFor="">Data de nascimento:</label>
                            <input type="date" className="form-control" name="birthDate"
                            value={this.state.user.birthDate} 
                            onChange={e => this.updateField(e)}
                            placeholder="" />
                        </div>
                    </div>
                 </div> 
                 <hr />
                 <div className="row">
                     <div className="col-12 d-flex justify-content-end">
                         <button className="btn btn-success" onClick={e => this.save(e)}>
                             Salvar
                         </button>
                         <button className="btn btn-secondary ml-2" onClick={e => this.clear(e)}>
                             Limpar
                         </button>
                     </div>
                 </div>
            </div>
        )
    }

    load(user) {
        this.setState({user})
    }

    remove(user) {
        axios.delete(`${baseUrl}/${user.id}`).then(resp => {
            const list = this.getUpdateList(user, false)
            this.setState({list})
        })
    }

    renderTable() {
        return (
            <table className="table mt-4">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>Sobrenome</th>
                        <th>Email</th>
                        <th>Data de nascimento</th>
                        <th>Açôes</th>
                    </tr>
                </thead>
                <tbody>
                    {this.renderRows()}
                </tbody>
            </table>
        )
    }

    renderRows(){
        return this.state.list.map( user => {
            return (
                <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.surname}</td>
                    <td>{user.email}</td>
                    <td>{user.birthDate}</td>
                    <td>
                        <button className="btn btn-warning" onClick={e => this.load(user)}>
                            <i className="fa fa-pencil"></i>
                        </button>
                        <button className="btn btn-danger ml-2" onClick={e => this.remove(user)}>
                            <i className="fa fa-trash"></i>
                        </button>
                    </td>
                </tr>
            )
        })
    }
    
    render() {
        return (
            <Main {...headerProps}>
                {this.renderForm()}
                {this.renderTable()}
            </Main>
        )
    }
}