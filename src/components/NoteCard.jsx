import "../assets/css/card.css";
import parse from 'html-react-parser';
import Swal from "sweetalert2";

export const NoteCard = ({ onPreview, onUpdate, onDelete, note }) => {
  const cardStyle = {
    backgroundColor: note?.color || "#ffffff", // Default to white if color is not specified
  };
  const handleDelete = () => {
    // Show confirmation alert
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger"
      },
    });
    swalWithBootstrapButtons.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      confirmButtonColor: "green",
      cancelButtonColor: "#d33",
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        onDelete(note?.id);
        swalWithBootstrapButtons.fire({
          title: "Deleted!",
          text: "Your Note has been deleted Successfully...",
          icon: "success"
        });
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire({
          title: "Cancelled",
          text: "Your Note is safe :)",
          icon: "error"
        });
      }
    });
  };
  return (
    <div className="note-card">
      <div className="note-card-wrapper" style={cardStyle}>
        <h2 className="card-title" onClick={() => onPreview(note)}>
          {note?.title}
        </h2>
        <div className="card-body">
          {parse(note?.desc)}
        </div>
        <span className="card-details" onClick={() => onPreview(note)}>
          read more
        </span>
        <div className="card-footer">
          <span className="card-timeline">{note?.createdAt}</span>
          <div className="card-actions">
            <div className="action-item" onClick={() => onUpdate(note)}>
              <i className="fa-solid fa-pen-to-square edit"></i>
            </div>
            <div className="action-item" onClick={handleDelete}>
              <i className="fa-solid fa-trash-can delete"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
