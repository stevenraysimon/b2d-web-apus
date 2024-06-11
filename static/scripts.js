function uploadFiles() {
    const files = document.getElementById('fileInput').files;
    const contentDiv = document.getElementById('contentDiv');
    const isOverview = document.getElementById('overviewCheckbox').checked;
    const imageFile = document.getElementById('imageInput').files[0];

    for (let i = 0; i < files.length; i++) {
        let formData = new FormData();
        formData.append('file', files[i]);
        formData.append('isOverview', isOverview);
        if (imageFile) {
            formData.append('image', imageFile);
        }

        fetch('/upload', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.content) {
                // Create a new paragraph for the new content
                let p = document.createElement('p');
                p.innerText = data.content;

                // Append the banner image if provided
                if (data.image_url) {
                    let img = document.createElement('img');
                    img.src = data.image_url;
                    img.style.width = '100%';
                    contentDiv.appendChild(img);
                }

                // Only append a line break if there is already content in the div
                if (contentDiv.children.length > 0) {
                    // Append a line break or a spacer paragraph before the new content
                    let br = document.createElement('br');
                    contentDiv.appendChild(br);
                }

                contentDiv.appendChild(p);
            }
        })
        .catch(error => console.error('Error:', error));
    }
}

function clearContent() {
    const contentDiv = document.getElementById('contentDiv');
    contentDiv.innerHTML = ''; // Clear the content

    // Send a request to the server to clear stored content
    fetch('/clear-content', {
        method: 'POST'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to clear content.');
        }
    })
    .catch(error => console.error('Error:', error));
}


function downloadContent() {
    fetch('/download')
    .then(response => {
        if (response.ok) {
            return response.blob();
        }
        throw new Error('Network response was not ok.');
    })
    .then(blob => {
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'output.docx');
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
    })
    .catch(error => console.error('Error:', error));
}

function showImagePreview() {
    const fileInput = document.getElementById('imageInput');
    const imagePreviewDiv = document.getElementById('imagePreviewDiv');
    const imagePreview = document.getElementById('imagePreview');

    const file = fileInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            imagePreview.src = e.target.result;
            imagePreviewDiv.classList.remove('hidden');
        }
        reader.readAsDataURL(file);
    } else {
        imagePreview.src = '';
        imagePreviewDiv.classList.add('hidden');
    }
}
