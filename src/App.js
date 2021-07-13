import './App.css';
import React, { Component } from 'react';
import shortid from 'shortid';
import toast, { Toaster } from 'react-hot-toast';

import ContactForm from './components/ContactForm/ContactForm';
import Filter from './components/Filter/Filter';
import ContactList from './components/ContactsList/ContactsList';

import defaultContacts from './db/contacts.json';

class App extends Component {
  state = {
    contacts: defaultContacts,
    name: '',
    filter: '',
  };

  addContact = ({ name, number }) => {
    const contact = {
      id: shortid.generate(),
      name,
      number,
    };

    const { contacts } = this.state;
    contacts.find(
      ({ name }) => name.toLowerCase() === contact.name.toLowerCase(),
    )
      ? toast.error(`${name} is already added.`)
      : this.setState(({ contacts }) => ({ contacts: [...contacts, contact] }));
  };

  deleteContact = contactId => {
    this.setState(prevState => ({
      contacts: prevState.contacts.filter(contact => contact.id !== contactId),
    }));
  };

  changeInput = e => {
    this.setState({ filter: e.target.value });
  };

  getVisibleContacts = () => {
    const { filter, contacts } = this.state;
    const normalizedFilter = filter.toLowerCase();

    return contacts.filter(contact =>
      contact.name.toLowerCase().includes(normalizedFilter),
    );
  };

  componentDidMount() {
    const contacts = localStorage.getItem('contacts');
    const parsedContacts = JSON.parse(contacts);

    if (parsedContacts) {
      this.setState({ contacts: parsedContacts });
    }

    if (contacts === '[]') {
      this.setState({ contacts: defaultContacts });
    }
  }

  componentDidUpdate(_, prevState) {
    if (prevState.contacts !== this.setState.contacts) {
      localStorage.setItem('contacts', JSON.stringify(this.state.contacts));
    }
  }

  render() {
    const { filter } = this.state;

    return (
      <>
        <div>
          <h2>My phonebook</h2>
          <Toaster />

          <ContactForm onSubmit={this.addContact} />
          <Filter value={filter} onChange={this.changeInput} />

          <h2>My contacts:</h2>

          <ContactList
            contacts={this.getVisibleContacts()}
            onDelete={this.deleteContact}
          />
        </div>
      </>
    );
  }
}

export default App;
