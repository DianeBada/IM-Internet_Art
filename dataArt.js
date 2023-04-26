const canvas = document.getElementById('galaxy');
const ctx = canvas.getContext('2d');
const images = [];
const displayInterval = 1600; // 2 seconds
let displayedImagesCount = 0;
let particles = [];
let canDisplayImages = false; // Flag to determine if images can be displayed

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Set up the text to be displayed
const text1 = "What's the beauty";
const text2 = "Behind the student chaos, you may ask?";
const text3 = 'MEMES!';
const text4 = "Some of those were beautifully hilarious, right?";
const textFont = '62px sans-serif';
ctx.font = textFont;
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
const textWidth1 = ctx.measureText(text1).width;
const textWidth2 = ctx.measureText(text2).width;
const textWidth3 = ctx.measureText(text3).width;
const textHeight = parseInt(textFont, 10);

// Wait for the font to be loaded
document.fonts.ready.then(() => {
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the first text
  ctx.fillStyle = 'white';
  ctx.fillText(text1, canvas.width / 2, canvas.height / 2);

  // Wait 2 seconds and then display the second text
  setTimeout(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillText(text2, canvas.width / 2, canvas.height / 2);

    // Wait 2 seconds and then display the third text
    setTimeout(() => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillText(text3, canvas.width / 2, canvas.height / 2);
      canDisplayImages = true; // Set the flag to true to allow image display

      // Wait 2 seconds and then clear the canvas and fetch the images
      setTimeout(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        fetchImages();
      }, 2000);

    }, 2000);

  }, 2000);
});

function fetchImages() {
  fetch("https://www.reddit.com/r/CollegeMemes/.json?limit=25")
    .then((response) => response.json())
    .then((data) => {
      const imagePosts = data.data.children.filter((post) => post.data.post_hint === "image");
      images.push(...imagePosts.map((post) => post.data.url));
      setInterval(displayImage, displayInterval);
    })
    .catch((error) => console.error(error));
}
let allParticlesDissipated = false; // flag to track when all particles have dissipated

function displayImage() {
  if (canDisplayImages && images.length > 0 && displayedImagesCount < images.length) {
    const imgUrl = images[displayedImagesCount];
    const img = new Image();
    img.onload = function() {
      const maxWidth = 300;
      const maxHeight = 400;
      let width = img.width;
      let height = img.height;
      if (width > maxWidth) {
        height *= maxWidth / width;
        width = maxWidth;
      }
      if (height > maxHeight) {
        width *= maxHeight / height;
        height = maxHeight;
      }
      const x = Math.random() * (canvas.width - width);
      const y = Math.random() * (canvas.height - height);
      ctx.drawImage(img, x, y, width, height);
      displayedImagesCount++;
      if (displayedImagesCount === images.length) {
      // Explode the images
      let particles = [];
      const particleCount = 1000;
      for (let i = 0; i < particleCount; i++) {
      const particle = {
      x: canvas.width / 2,
      y: canvas.height / 2,
      radius: Math.random() * 5 + 1,
      color: `hsl(${Math.random() * 360}, 50%, 50%)`,
      velocity: {
      x: (Math.random() - 0.5) * 5,
      y: (Math.random() - 0.5) * 5
      }
      };
      particles.push(particle);
      }
      function animate() {
        requestAnimationFrame(animate);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      
        for (let i = 0; i < particles.length; i++) {
          ctx.beginPath();
          ctx.arc(particles[i].x, particles[i].y, particles[i].radius, 0, Math.PI * 2);
          ctx.fillStyle = particles[i].color;
          ctx.fill();
      
          particles[i].x += particles[i].velocity.x;
          particles[i].y += particles[i].velocity.y;
          if (particles[i].radius < 0.1) {
            particles[i].radius = 0.1;
          }
        }
      
        particles = particles.filter(p => p.radius > 0.1); // Filter out particles with radius < 0.1
      
        if (particles.length <= 0.1) {
          // All particles have dissipated, so display final text
          displayFinalText();
        }
      }
      
      function displayFinalText() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'white';
        ctx.font = 'bold 48px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Thank you for watching!', canvas.width / 2, canvas.height / 2);
      }
      
      animate(); // Start the animation loop after the images have exploded
  }
};
img.src = imgUrl;
}
}

fetchImages();