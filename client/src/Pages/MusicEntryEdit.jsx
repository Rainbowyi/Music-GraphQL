//React
import { useEffect } from 'react'; // useEffect hook
import { Controller, useForm } from 'react-hook-form'; // React Hook Forms
import Joi from 'joi'; // Joi Validation
import { joiResolver } from '@hookform/resolvers/joi'; // Joi Resolver for React Hook Forms
import { useParams, useNavigate } from 'react-router-dom'; // React Router
//Apollo Client
import { useMutation, useQuery } from '@apollo/client'; // Apollo Client Hooks - useMutation
import { GET_MUSIC_ENTRY } from '../graphQL/queries/queries'; // GraphQL Query
import { UPDATE_MUSIC_ENTRY } from '../graphQL/mutations/mutations'; // GraphQL Mutation
//React Bootstrap
import { Card, Col, Form, Row, Button, Alert } from 'react-bootstrap';

// This component is used to edit music entries
function MusicEntryEdit(props) {
  const userData = props.user; // User Data from App.js
  const { musicEntryId } = useParams(); // Get the music entry id from the url
  const navigate = useNavigate(); // Navigate function to navigate to a different page

  // GraphQL Query to get the music entry
  // GET_music_ENTRY - GraphQL Query
  // musicEntryId - The id of the music entry to get
  // userData.token - The token from the user data
  const { loading, error, data } = useQuery(GET_MUSIC_ENTRY, {
    variables: { musicEntryId },
    context: {
      headers: {
        authorization: `${userData.token}`,
      },
    },
  });

  // GraphQL Mutation for updating a music entry
  const [updateMusicEntry] = useMutation(
    UPDATE_MUSIC_ENTRY
    // , {
    // update the cache to update the music entry
    // update(cache, { data: { updateMusicEntry } }) {
    //   // read the music entry from the cache
    //   const { musicEntry } = cache.readQuery({
    //     query: GET_MUSIC_ENTRY,
    //     variables: { id: musicEntryId },
    //   }) || { musicEntry: null };
    //   // write the updated music entry to the cache
    //   if (musicEntry) {
    //     // write the updated music entry to the cache
    //     cache.writeQuery({
    //       query: GET_MUSIC_ENTRY,
    //       variables: { id: musicEntryId },
    //       data: {
    //         musicEntry: {
    //           ...musicEntry,
    //           ...updateMusicEntry,
    //         },
    //       },
    //     });
    //   }
    // },
    // }
  );

  // onSubmit - Called when the form is submitted
  const onSubmit = async (formData, event) => {
    console.log('test');
    event.preventDefault();

    const { title, rate, style } = formData;
    try {
      // update the music entry
      await updateMusicEntry({
        variables: {
          updateMusicEntryId: musicEntryId,
          input: { title, rate, style, user: userData.id },
        },
        context: {
          headers: {
            authorization: `${userData.token}`,
          },
        },
      });

      // redirect to music entry page
      navigate('/');
    } catch (error) {
      console.error(`Failed to update music entry: ${error.message}`);
    }
  };

  // JOI Validation for React-Hook-Forms
  const schema = Joi.object({
    title: Joi.string().min(3).max(256),
    rate: Joi.number().min(0).max(100),
    style: Joi.string().min(3).max(1024),
  });

  // React-Hook-Forms
  // control - React Hook Forms Controller this is used to control the input
  // watch - React Hook Forms watch function this is used to watch an input
  // handleSubmit - React Hook Forms handleSubmit function this is used to handle the submit event
  // setValue - React Hook Forms setValue function this is used to set the value of an input
  // formState - React Hook Forms formState this is used to access the form state
  // resolver - React Hook Forms resolver this is used to validate the form
  const {
    control,
    watch,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: joiResolver(schema),
  });

  const watchMood = watch('rate'); // watch is a React Hook Form function that watches a specific input field. In this case, it is watching the mood input field.

  // This function converts the mood score to an emoji
  const scoreToEmoji = (score) => {
    const emojiSadToHappy = ['😀', '😐', '😭', '😠', '🤬'];
    return emojiSadToHappy[score];
  };
  //I need this as the mood loads in a few secs after the page loads and I need to set the value of the mood to the current mood
  useEffect(() => {
    if (data) {
      setValue('rate', data.musicEntry.rate);
    }
  }, [data]);

  if (loading) return <p>Loading... 🤔</p>;
  if (error) return <p>Error 😭</p>;

  return (
    <Card className={'shadow text-white m-3 ' + `bg-${watchMood}`}>
      <Card.Body>
        <Form noValidate='noValidate' onSubmit={handleSubmit(onSubmit)}>
          <div className='d-flex align-items-center'>
            {/* Emoji */}
            <div className='emoji me-2 rounded-circle inner-shadow-emoji-large'>
              {scoreToEmoji(watchMood)}
            </div>
            {/* /Emoji */}
            {/* Title Text Box */}
            <div className='title w-100'>
              <Controller
                name='title'
                control={control}
                defaultValue={data.musicEntry.title}
                render={({ field }) => (
                  <Form.Control type='text' placeholder='Title' {...field} />
                )}
              />
              {errors.title && (
                <Alert variant='dark'>{errors.title.message}</Alert>
              )}
            </div>
            {/* /Title Text Box */}
          </div>
          {/* Range Slider For Mood*/}
          <Row>
            <Col xs='2' className='text-center emoji'>
              😀
            </Col>
            <Col xs='8'>
              {/* Range Slider */}
              <Controller
                name='rate'
                control={control}
                defaultValue={1}
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
          {/* /Range Slider for Mood */}
          {/* Why Text Box */}
          <Controller
            name='style'
            control={control}
            defaultValue={data.musicEntry.style}
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
          {/* /Why Text Box */}
          {/* Submit Button */}
          <Button
            // onClick={() => {
            //   handleSubmit(onSubmit);
            // }}
            variant='dark'
            size='lg'
            block='true'
            className='w-100'
            type='submit'
          >
            Submit <i className='bi bi-send-fill'></i>
          </Button>
          {/* /Submit Button */}
        </Form>
      </Card.Body>
    </Card>
  );
}

export default MusicEntryEdit;
