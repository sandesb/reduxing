import { useSearchParams } from 'react-router-dom';
import { useGetContentQuery } from '../../../../redux/subjectsApi';

export default function CompareNotes() {
  const [searchParams] = useSearchParams();
  const content_id = searchParams.get('content_id'); // Extract content_id
  let matric = searchParams.get('matric'); // Extract matric

  // Treat "null" string as an actual null
  if (matric === "null") {
    matric = null;
  }

  console.log("content_id:", content_id);
  console.log("matric:", matric);

  // Fetch content details (including note) using useGetContentQuery
  const { data: contentData, error: contentError, isLoading: isLoadingContent } = useGetContentQuery({
    content_id,
    matric: matric || null, // Pass matric if available, otherwise pass null
  });

  console.log("Fetched content data:", contentData);

  if (isLoadingContent) return <div>Loading...</div>;
  if (contentError) return <div>Error loading content</div>;

  // Access the first object in the contentData array and safely parse the JSON from the "note" column if it exists
  const firstContentItem = contentData && contentData.length > 0 ? contentData[0] : null;
  let noteData = null;

  if (firstContentItem && firstContentItem.note) {
    try {
      noteData = firstContentItem.note; // note is already in JSON format
    } catch (error) {
      console.error("Error parsing note JSON:", error);
    }
  }

  return (
    <div>
      <h1>Compare Notes</h1>
      {/* Check if contentData exists and display the content name */}
      {firstContentItem ? (
        <div>
          <h2>Content Name: {firstContentItem.name}</h2>
          <p>Matric: {firstContentItem.matric || 'No matric provided'}</p>
        </div>
      ) : (
        <div>No content data found</div>
      )}

      {/* Display parsed note data */}
      {noteData ? (
        <div>
          <h3>Note Details:</h3>
          <pre>{JSON.stringify(noteData, null, 2)}</pre> {/* Display note content as JSON */}
          
          {/* Optionally display specific fields from the JSON */}
          {noteData.blocks && noteData.blocks.length > 0 ? (
            <div>
              <h4>Note Blocks:</h4>
              {noteData.blocks.map((block, index) => (
                <div key={index}>
                  <p>Block ID: {block.id}</p>
                  <p>Data: {block.data?.file?.url || 'No file data'}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>No blocks data found in note</p>
          )}
        </div>
      ) : (
        <p>No note data available</p>
      )}
    </div>
  );
}
