function compressAndDownload() {
    const fileInput = document.getElementById('imageInput');
    const targetSizeKB = parseInt(document.getElementById('targetSize').value);
    const preview = document.getElementById('preview');
    const originalSizeText = document.getElementById('originalSize');
    const compressedSizeText = document.getElementById('compressedSize');
  
    if (!fileInput.files[0] || !targetSizeKB) {
      alert("Please upload an image and set target size.");
      return;
    }
  
    const file = fileInput.files[0];
    const reader = new FileReader();
  
    reader.onload = function(event) {
      const img = new Image();
      img.onload = function () {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
  
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
  
        let quality = 0.9;
        let compressedBlob;
  
        function tryCompress() {
          canvas.toBlob(function(blob) {
            const sizeKB = blob.size / 1024;
            if (sizeKB > targetSizeKB && quality > 0.1) {
              quality -= 0.05;
              tryCompress();
            } else {
              compressedBlob = blob;
              const compressedUrl = URL.createObjectURL(blob);
              preview.src = compressedUrl;
  
              // Show sizes
              originalSizeText.textContent = `Original Size: ${(file.size / 1024).toFixed(2)} KB`;
              compressedSizeText.textContent = `Compressed Size: ${sizeKB.toFixed(2)} KB`;
  
              // Download
              const link = document.createElement('a');
              link.href = compressedUrl;
              link.download = 'compressed-image.jpg';
              link.click();
            }
          }, 'image/jpeg', quality);
        }
  
        tryCompress();
      };
      img.src = event.target.result;
    };
  
    reader.readAsDataURL(file);
  }
  