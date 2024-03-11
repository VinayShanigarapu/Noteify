import React, { useState } from 'react';
import { v4 as getID } from 'uuid';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import logo from "../assets/Image/upload.png";
import '../assets/css/upsert.css';
import Swal from 'sweetalert2';

const generateRainbowColor = () => {
  let maxVal = 0xFFFFFF; // 16777215
  let randomNumber = Math.random() * maxVal;
  randomNumber = Math.floor(randomNumber);
  randomNumber = randomNumber.toString(16);
  let randColor = randomNumber.padStart(6, 0);
  return `#${randColor.toUpperCase()}`;
};

const primaryColors = ["#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF"];

export const UpsertNote = ({ setOpen, note, createNote, updateNote }) => {
  const [title, setTitle] = useState(note ? note?.title : "");
  const [desc, setDesc] = useState(note ? note?.desc : "");
  const [color, setColor] = useState(note ? note?.color : generateRainbowColor());
  const [media, setMedia] = useState(null);

  const clearInputs = () => {
    setTitle("");
    setDesc("");
    setColor(generateRainbowColor());
    setMedia(null);
  };

  const handleClear = (event) => {
    const imgView = document.getElementById("img-view");
    imgView.style.backgroundImage = ``;
    const imgElement = imgView.querySelector("img");
    const pElement = imgView.querySelector("p");
    const spanElement = imgView.querySelector("span");

    if (imgElement) {
      imgElement.style.visibility = "visible"; // or imgElement.style.display = "none";
    }

    if (pElement) {
      pElement.style.visibility = "visible"; // or pElement.style.display = "none";
    }

    if (spanElement) {
      spanElement.style.visibility = "visible"; // or spanElement.style.display = "none";
    }
    event.preventDefault();
    clearInputs();
  };

  const formatDateTime = () => {
    const currentDate = new Date();
    const options = {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    };
    return currentDate.toLocaleString('en-US', options);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formattedDate = formatDateTime();

    if (note) {
      // update note
      const updatedNote = {
        ...note,
        title,
        desc,
        color,
        createdAt: formattedDate,
        media: media ? media : null, // Set media to null if no new media is selected
      };

      updateNote(updatedNote);
    } else {
      // create note
      createNote({
        id: getID(),
        title,
        desc,
        color,
        media,
        createdAt: formattedDate,
      });
    }

    clearInputs();
    setOpen(false);
  };
  const handleFileError = () => {
      setMedia(null);
      const imgView = document.getElementById("img-view");
      imgView.style.backgroundImage = ``;
      const imgElement = imgView.querySelector("img");
      const pElement = imgView.querySelector("p");
      const spanElement = imgView.querySelector("span");

      if (imgElement) {
        imgElement.style.visibility = "visible"; // or imgElement.style.display = "none";
      }

      if (pElement) {
        pElement.style.visibility = "visible"; // or pElement.style.display = "none";
      }

      if (spanElement) {
        spanElement.style.visibility = "visible"; // or spanElement.style.display = "none";
      }
  }
  const handleMediaChange = (event, file) => {
    const inputFile = document.getElementById("input-file");
    const imgView = document.getElementById("img-view");

    if (file) {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      inputFile.files = dataTransfer.files;
    }

    const selectedFile = inputFile.files[0];
    
    if (inputFile && inputFile.files.length > 0) {
      if (selectedFile.size >= 778240 ) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "You can only insert upto (750 KB). Please select a smaller file!!",
      });
      handleFileError();
      inputFile.value = null;
      return;
    }
      const reader = new FileReader();

      reader.onload = (e) => {
        const mediaDataUrl = e.target.result;
        setMedia(mediaDataUrl);
      };

      // Read the content of the file as a data URL
      reader.readAsDataURL(selectedFile);
      let imgLink = URL.createObjectURL(inputFile.files[0]);
      imgView.style.backgroundImage = `url(${imgLink})`;

      // Hide text content inside imgView
      const imgElement = imgView.querySelector("img");
      const pElement = imgView.querySelector("p");
      const spanElement = imgView.querySelector("span");

      if (imgElement) {
        imgElement.style.visibility = "hidden"; // or imgElement.style.display = "none";
      }

      if (pElement) {
        pElement.style.visibility = "hidden"; // or pElement.style.display = "none";
      }

      if (spanElement) {
        spanElement.style.visibility = "hidden"; // or spanElement.style.display = "none";
      }
    } else {
      // User didn't select a file, so remove existing media
      handleFileError();
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    handleMediaChange(null, droppedFile);
  };

  return (
    <div className="upsert-note">
      <div className="upsert-wrapper">
        <div className="upsert-header">
          <h2 className="heading">{note ? 'Update Note' : 'Add Note'}</h2>
          <div className="close-btn" onClick={() => setOpen(false)}>
            <i className="fa-solid fa-xmark"></i>
          </div>
        </div>
        <form className="upsert-form" onSubmit={handleSubmit}>
          <input
            required
            type="text"
            placeholder="Title"
            className="input-form"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <ReactQuill
            className="quill-editor"
            theme="snow"
            placeholder="Enter your description"
            value={desc}
            onChange={(value) => setDesc(value)}
          />
          {/* File input for media */}
          <label id='drop-area'>
            <input type='file' accept='image/*, video/*' id='input-file' hidden onChange={(e) => handleMediaChange(e)} />
            <center>
              <div id='img-view' onDragOver={handleDragOver} onDrop={handleDrop}>
                <img src={logo} alt="Uploaded" />
                <p>Drag and drop or click here<br />to upload image<br /></p>
                <span>Upload any images from desktop</span>
              </div>
            </center>
          </label>
          <div className="upsert-actions">
            <i className="fa-solid fa-palette"></i>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              list="primaryColors"
            />
            <datalist id="primaryColors">
              {primaryColors.map((colorOption, index) => (
                <option key={index} value={colorOption} />
              ))}
            </datalist>
            <button className="clear-btn" onClick={handleClear}>
              Clear
            </button>
            <button type="submit" className="save-btn">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
