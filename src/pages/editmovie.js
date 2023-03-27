import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Container, Form, Button } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

function CreateMovie() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { getAccessTokenSilently } = useAuth0();

  const [title, setTitle] = useState('');
  const [releaseDate, setReleaseDate] = useState('');

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const accessToken = await getAccessTokenSilently({
          audience: 'https://NoahCapstone'
        });
        const response = await axios.get(`http://localhost:5000/movies/${id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        console.log(response)
        setTitle(response.data.movie.title);
        setReleaseDate(response.data.movie.release_date);
      } catch (error) {
        console.error(error);
      }
    };
    fetchMovie();
  }, [getAccessTokenSilently, id]);

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleReleaseDateChange = (event) => {
    setReleaseDate(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const accessToken = await getAccessTokenSilently({
        audience: 'https://NoahCapstone'
      });
      const response = await axios.patch(`http://localhost:5000/movies`, {
        id,
        title,
        release_date: releaseDate
      }, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      console.log(response);
      navigate('/movies');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container>
        <h1 className='top-spacer'>Create Movie</h1>
        <div style={{ height: '300px', backgroundColor: '#F6F1F1' }}>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formTitle">
                <Form.Label>Title</Form.Label>
                <Form.Control type="text" placeholder="Enter title" value={title} onChange={handleTitleChange} />
              </Form.Group>

              <Form.Group controlId="formReleaseDate">
                <Form.Label>Release Date</Form.Label>
                <Form.Control type="text" placeholder="Enter release date" value={releaseDate} onChange={handleReleaseDateChange} />
              </Form.Group>

              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Form>
        </div>
    </Container>
  );
}

export default CreateMovie;
