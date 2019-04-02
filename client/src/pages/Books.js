import React, { Component } from "react";
import DeleteBtn from "../components/DeleteBtn";
import Jumbotron from "../components/Jumbotron";
import API from "../utils/API";
import { Link } from "react-router-dom";
import { Col, Row, Container } from "../components/Grid";
import { List, ListItem } from "../components/List";
import { Input, TextArea, FormBtn } from "../components/Form";
// Added VV
import FormSearch from "../components/FormSearch";
import Card from "../components/Card";
import Book from "../components/Book";

class Books extends Component {
  state = {
    books: [],
    // Added VV home
    q: "",
    message: "Search For A Book To Begin!"
    // title: "",
    // author: "",
    // synopsis: ""
  };

  componentDidMount() {
    this.loadBooks();
  }

  loadBooks = () => {
    API.getBooks()
      //Added VV
      .then(res =>
        this.setState({
          books: res.data
        })
      )
      // .then(res => this.setState({ books: res.data, title: "", author: "", synopsis: "" }))
      .catch(err => console.log(err));
  };

  deleteBook = id => {
    API.deleteBook(id)
      .then(res => this.loadBooks())
      .catch(err => console.log(err));
  };

  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };
  // Added VV Home
  getBooks = () => {
    API.getBooks(this.state.q)
      .then(res =>
        this.setState({
          books: res.data
        })
      )
      .catch(() =>
        this.setState({
          books: [],
          message: "No New Books Found, Try a Different Query"
        })
      );
  };
  // Added End

  handleFormSubmit = event => {
    event.preventDefault();
    // Added
    this.getBooks();
    // if (this.state.title && this.state.author) {
    //   API.saveBook({
    //     title: this.state.title,
    //     author: this.state.author,
    //     synopsis: this.state.synopsis
    //   })
    //     .then(res => this.loadBooks())
    //     .catch(err => console.log(err));
    // }
  };
  // Added VV
  handleBookSave = id => {
    const book = this.state.books.find(book => book.id === id);

    API.saveBook({
      googleId: book.id,
      title: book.volumeInfo.title,
      subtitle: book.volumeInfo.subtitle,
      link: book.volumeInfo.infoLink,
      authors: book.volumeInfo.authors,
      description: book.volumeInfo.description,
      image: book.volumeInfo.imageLinks.thumbnail
    }).then(() => this.getBooks());
  };
  // Added End

  render() {
    return (
      <Container fluid>
        <Row>
          <Col size="md-6">
            <Jumbotron>
              <h1>What Books Should I Read?</h1>
            </Jumbotron>
            {/* Added */}
            <FormSearch
              handleInputChange={this.handleInputChange}
              handleFormSubmit={this.handleFormSubmit}
              q={this.state.q}
            />
            {/* Added End */}
            <form>
              <Input
                value={this.state.title}
                onChange={this.handleInputChange}
                name="title"
                placeholder="Title (required)"
              />
              <Input
                value={this.state.author}
                onChange={this.handleInputChange}
                name="author"
                placeholder="Author (required)"
              />
              <TextArea
                value={this.state.synopsis}
                onChange={this.handleInputChange}
                name="synopsis"
                placeholder="Synopsis (Optional)"
              />
              <FormBtn
                disabled={!(this.state.author && this.state.title)}
                onClick={this.handleFormSubmit}
              >
                Submit Book
              </FormBtn>
              {/* Added */}
              <Col size="12">
                <Card title="Results">
                  {this.state.books.length ? (
                    <List>
                      {this.state.books.map(book => (
                        <Book
                          key={book.id}
                          title={book.volumeInfo.title}
                          subtitle={book.volumeInfo.subtitle}
                          link={book.volumeInfo.infoLink}
                          authors={book.volumeInfo.authors.join(", ")}
                          description={book.volumeInfo.description}
                          image={book.volumeInfo.imageLinks.thumbnail}
                          Button={() => (
                            <button
                              onClick={() => this.handleBookSave(book.id)}
                              className="btn btn-primary ml-2"
                            >
                              Save
                            </button>
                          )}
                        />
                      ))}
                    </List>
                  ) : (
                    <h2 className="text-center">{this.state.message}</h2>
                  )}
                </Card>
              </Col>
              {/* Added End*/}
            </form>
          </Col>
          <Col size="md-6 sm-12">
            <Jumbotron>
              <h1>Books On My List</h1>
            </Jumbotron>
            {this.state.books.length ? (
              <List>
                {this.state.books.map(book => (
                  <ListItem key={book._id}>
                    <Link to={"/books/" + book._id}>
                      <strong>
                        {book.title} by {book.author}
                      </strong>
                    </Link>
                    <DeleteBtn onClick={() => this.deleteBook(book._id)} />
                  </ListItem>
                ))}
              </List>
            ) : (
              <h3>No Results to Display</h3>
            )}
          </Col>
        </Row>
      </Container>
    );
  }
}

export default Books;
