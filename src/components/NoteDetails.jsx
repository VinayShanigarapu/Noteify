import React from 'react';
import "../assets/css/details.css";
import parse from 'html-react-parser';

export const NoteDetails = ({ setView, note }) => {
  const cardStyle = {
    backgroundColor: note?.color || "#ffffff",
  };

  const getMediaType = (media) => {
    if (typeof media === "string") {
      const lowerCaseMedia = media.toLowerCase();

      if (lowerCaseMedia.startsWith('data:image')) {
        return 'image';
      } else if (lowerCaseMedia.startsWith('data:video')) {
        return 'video';
      } else if (
        lowerCaseMedia.endsWith('.jpg') ||
        lowerCaseMedia.endsWith('.jpeg') ||
        lowerCaseMedia.endsWith('.png') ||
        lowerCaseMedia.endsWith('.gif')
      ) {
        return 'image';
      } else if (
        lowerCaseMedia.endsWith('.mp4') ||
        lowerCaseMedia.endsWith('.webm') ||
        lowerCaseMedia.endsWith('.ogg')
      ) {
        return 'video';
      }
    }

    return 'unsupported';
  };
  
  const mediaType = getMediaType(note?.media);

  return (
    <div className="note-details">
      <div className="details-wrapper" style={cardStyle}>
        <div className="details-back-btn" onClick={() => setView(false)}>
          <i className="fa-solid fa-arrow-left"></i>
        </div>
        <h2 className="details-title">{note?.title}</h2>
        <span className="details-timeline">{note?.createdAt}</span>

        <div className="details-body">
          {parse(note?.desc)}
        </div>

        {/* Display media section */}
        <center>{note?.media && (
          <div className="details-media">
            {mediaType === 'image' ? (
              <img src={note.media} alt="Media" />
            ) : mediaType === 'video' ? (
              <video controls>
                <source src={note.media} type={note.media.type} />
                Your browser does not support the video tag.
              </video>
            ) : (
              <p>Unsupported media type</p>
            )}
          </div>
        )}</center>
      </div>
    </div>
  );
};
