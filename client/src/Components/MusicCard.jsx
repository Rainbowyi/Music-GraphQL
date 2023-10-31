import { Card, Button } from 'react-bootstrap'; //import the Card and Button components from react bootstrap
import { useMutation, gql } from '@apollo/client'; //import the useMutation hook from apollo client
import { Link } from 'react-router-dom'; //import the Link component
import { DELETE_MUSIC_ENTRY } from '../graphQL/mutations/mutations'; //import the delete music entry mutation

//This component is used to display the music entries on the home page
function MusicCard({ data, user }) {
  //function to convert the mood score to an emoji
  const scoreToEmoji = (score) => {
    const emojiSadToHappy = ['😀', '😐', '😭', '😠', '🤬'];
    return emojiSadToHappy[score];
  };
  //function to convert the timestamp to a date
  const formatDate = (timestamp) => {
    const date = new Date(parseInt(timestamp)).toLocaleDateString();
    return toString(date);
  };

  //useMutation hook to delete music entries
  const [deleteMusicEntry] = useMutation(DELETE_MUSIC_ENTRY, {
    context: {
      headers: {
        authorization: `${user.token}`,
      },
    },
    //update the cache to remove the deleted music entry
    update(cache) {
      cache.modify({
        fields: {
          //remove the deleted music entry from the musicEntries array
          //existingEntries is the array of music entries
          //readField is a function that reads a field from the cache
          musicEntries(existingEntries = [], { readField }) {
            //find the music entry that was deleted and remove it from the array
            return existingEntries.filter(
              (entryRef) => data.id !== readField('id', entryRef)
            );
          },
        },
      });
    },
  });

  //handle delete function for music entries
  const handleDelete = async () => {
    console.log(data.id);
    try {
      //delete the music entry
      //deletemusicEntryId is the id of the music entry to be deleted
      const result = await deleteMusicEntry({
        variables: { deleteMusicEntryId: data.id },
      });
      console.log(result);
      if (result.errors) {
        //if there are errors, throw an error
        throw new Error(result.errors[0].message);
      }
    } catch (error) {
      console.error(`Failed to delete music entry: ${error.message}`);
    }
  };

  return (
    <Card className={`shadow bg-${data.rate} text-white m-3`}>
      <Card.Body>
        <div className='d-flex'>
          {/* Displays the mood emoji */}
          <div className='emoji display-6 me-2 p-2 rounded-circle inner-shadow-emoji'>
            {scoreToEmoji(data.rate)}
          </div>
          {/* /Displays the mood emoji */}
          {/* Displays the title and date of the music entry */}
          <div className='title'>
            <Card.Title className='bold'>{data.title}</Card.Title>
            <Card.Subtitle className='mb-2 text-muted'>
              <i className='bi bi-calendar-event'></i>{' '}
              {new Date(parseInt(data.createdAt)).toLocaleString()}
            </Card.Subtitle>
          </div>
          {/* /Displays the title and date of the music entry */}
          {/* Displays the edit and delete buttons */}
          <div className='ms-auto'>
            <Link
              to={`music/edit/${data.id}`}
              variant='dark'
              size='sm'
              className='btn btn-dark rounded-circle inner-shadow mx-2'
            >
              <i className='bi bi-scissors text-white'></i>
            </Link>
            <Button
              variant='dark'
              size='sm'
              className='rounded-circle inner-shadow'
              onClick={handleDelete}
            >
              <i className='bi bi-trash2-fill text-white'></i>
            </Button>
            {/* /Displays the edit and delete buttons */}
          </div>
        </div>
        {/* Displays the body of the music entry */}
        <Card.Text className='mt-2'>{data.style}</Card.Text>
        {/* /Displays the body of the music entry */}
      </Card.Body>
    </Card>
  );
}

export default MusicCard;
