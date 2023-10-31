// React
import { Controller, useForm } from 'react-hook-form'; //React Hook Form
import Joi from 'joi'; //Joi Validation Library
import { joiResolver } from '@hookform/resolvers/joi'; //Joi Resolver for React Hook Form. - This is needed to use Joi with React Hook Form
// Apollo Client
import { useMutation, gql } from '@apollo/client'; //Apollo Client Hooks - useMutation
import { CREATE_MUSIC_ENTRY } from '../graphQL/mutations/mutations'; //GraphQL Mutation
// React Bootstrap
import { Card, Col, Form, Row, Button, Alert } from 'react-bootstrap'; //React Bootstrap

function MusicEntry(props) {
  const userData = props.user; //User Data from App.js
  //Joi Validation
  const schema = Joi.object({
    title: Joi.string().min(3).max(256),
    rate: Joi.number().min(0).max(100),
    style: Joi.string().min(3).max(1024),
  });

  //useForm
  //control - React Hook Forms Controller this is used to control the input
  //handleSubmit - React Hook Forms handleSubmit function this is used to handle the submit event
  //formState - React Hook Forms formState this is used to access the form state
  //reset - React Hook Forms reset function this is used to reset the form
  const {
    control,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: joiResolver(schema),
    defaultValues: {
      title: 'Waka Waka',
      rate: 1,
      style: 'Shakira Has The Biggest World Cup Song Of Them All. ',
    },
  });

  const watchMood = watch('mood'); //watch is a React Hook Form function that watches a specific input field. In this case, it is watching the mood input field.

  //onSubmit
  const onSubmit = async (data) => {
    data.user = userData.id; //Add the user id to the data object
    const { title, style, rate, user } = data; //Destructure the data object
    const token = userData.token; //Get the token from the user data
    await createMusic({ title, style, rate, user }, token); //Call the createmusic function and pass in the data object and the token
  };

  //This function converts the mood score to an emoji
  const scoreToEmoji = (score) => {
    const emojiSadToHappy = ['😀', '😐', '😭', '😠', '🤬'];
    return emojiSadToHappy[score];
  };

  //GraphQL Mutation for creating a music entry
  const [createMusicEntry] = useMutation(CREATE_MUSIC_ENTRY, {
    //update the cache to add the new music entry
    update(cache, { data: { createMusicEntry } }) {
      cache.modify({
        fields: {
          //add the new music entry to the musicEntries array
          musicEntries(existingEntries = []) {
            //create a new music entry reference
            const newEntryRef = cache.writeFragment({
              data: createMusicEntry,
              fragment: gql`
                fragment NewMusicEntry on MusicEntry {
                  id
                  title
                  style
                  rate
                  createdAt
                  updatedAt
                  user
                }
              `,
            });
            //return the new music entry reference and the existing music entries
            return [...existingEntries, newEntryRef];
          },
        },
      });
    },
  });
  //This function is used to create a music entry
  const createMusic = async (data, token) => {
    //Destructure the data object
    const { title, style, rate, user } = data;

    try {
      //Send the mutation request with data as input
      const result = await createMusicEntry({
        variables: {
          input: {
            title,
            style,
            rate,
            user,
          },
        },
        context: {
          headers: {
            authorization: `${token}`,
          },
        },
      });
      console.log(result.data.createMusicEntry);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Card className={'shadow text-white m-3 ' + `bg-${watchMood}`}>
      <Card.Body>
        <Form noValidate='noValidate' onSubmit={handleSubmit(onSubmit)}>
          <div className='d-flex align-items-center'>
            {/* Displays emoji based on mood score */}
            <div className='emoji me-2 rounded-circle inner-shadow-emoji-large'>
              {scoreToEmoji(watchMood)}
            </div>
            {/* /Displays emoji based on mood score */}
            <div className='title w-100'>
              {/* Why Text Box */}
              <Controller
                name='title'
                control={control}
                render={({ field }) => (
                  // Boostrap input text box component
                  <Form.Control
                    {...field}
                    type='text'
                    placeholder='Enter title'
                    aria-label='why'
                    aria-describedby='why do you feel this way'
                    className='bold mb-2 w-100 form-shadow'
                    size='lg'
                  />
                )}
              />
              {/* Error output */}
              {/* /Why Text Box */}

              {/* Date */}
              <Card.Subtitle className='pt-1 text-muted bold'>
                <i className='bi bi-calendar-event'></i>{' '}
                {new Date().toLocaleString()}
              </Card.Subtitle>
              {/* /Date */}
            </div>
          </div>
          {/* Error output */}
          {errors.title && (
            <Alert variant='dark' className='mt-2 mb-0'>
              {errors.title.message}
            </Alert>
          )}
          {/* Error output */}

          {/* Mood Range Slider */}
          <Row>
            <Col xs='2' className='text-center emoji'>
              😀
            </Col>
            <Col xs='8'>
              {/* Range Slider */}
              <Controller
                name='rate'
                control={control}
                defaultValue={2}
                render={({ field: { onChange, value } }) => (
                  <Form.Range
                    onChange={onChange}
                    value={value}
                    className='mt-3'
                    min='0'
                    max='4'
                  />
                )}
              />
              {/* /Range Slider */}
            </Col>
            <Col xs='2' className='text-center emoji'>
              🤬
            </Col>
          </Row>
          {/* /Mood Range Slider */}
          {/* Why Text Box */}
          <Controller
            name='style'
            control={control}
            render={({ field }) => (
              // Boostrap input text box component
              <Form.Control
                {...field}
                as='textarea'
                rows={3}
                placeholder='Why are you feeling this way? What happened?'
                aria-label='style'
                aria-describedby='why do you feel this way?'
                className='mb-2 w-100 form-shadow'
              />
            )}
          />
          {/* Error output */}
          {errors.style && (
            <Alert variant='dark' className='mt-2'>
              {errors.style.message}
            </Alert>
          )}
          {/* /Error output */}
          {/* Submit Button */}
          <Button
            variant='dark'
            size='lg'
            block='true'
            className='w-100'
            type='submit'
          >
            Submit <i className='bi bi-send-fill'></i>
          </Button>
          {/* Submit Button */}
        </Form>
      </Card.Body>
    </Card>
  );
}

export default MusicEntry;
