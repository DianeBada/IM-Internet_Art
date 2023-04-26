const canvas = document.getElementById('galaxy');
const ctx = canvas.getContext('2d');
const circles = [];

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const images = [];

function fetchImages() {
  fetch("https://www.reddit.com/r/CollegeMemes/.json?limit=3")
    .then((response) => response.json())
    .then((data) => {
      const imagePosts = data.data.children.filter((post) => post.data.post_hint === "image");
      images.push(...imagePosts.map((post) => post.data.url));
    })
    .catch((error) => console.error(error));
}

fetchImages();

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < 10; i++) {
    var radius = Math.random() * 30 + 1;
    var x = Math.random() * canvas.width;
    var y = Math.random() * canvas.height;
    var color = 'rgb(' + Math.floor(Math.random() * 256) + ',' + Math.floor(Math.random() * 256) + ',' + Math.floor(Math.random() * 256) + ')';
    var opacity = Math.random() * 0.5 + 0.5;

    var circle = {
      x: x,
      y: y,
      radius: radius,
      color: color,
      opacity: opacity,
      imgUrl: null
    };

    if (images.length > 0) {
      circle.imgUrl = images[Math.floor(Math.random() * images.length)];
    }

    ctx.beginPath();
    ctx.arc(circle.x, circle.y, circle.radius, 0, 2 * Math.PI);

    ctx.fillStyle = circle.color;
    ctx.globalAlpha = circle.opacity;
    ctx.fill();

    if (circle.imgUrl) {
      var img = new Image();
      img.src = circle.imgUrl;
      img.onload = function() {
        circle.width = img.width;
        circle.height = img.height;
        ctx.drawImage(img, circle.x - circle.width / 2, circle.y - circle.height / 2, circle.width, circle.height);
      };
    }

    circles.push(circle);
    ctx.fillStyle = circle.color;
    ctx.globalAlpha = circle.opacity;
    ctx.fill();

    if (circle.imgUrl) {
      var img = new Image();
      img.src = circle.imgUrl;
      img.onload = function() {
        circle.width = img.width;
        circle.height = img.height;
        ctx.drawImage(img, circle.x - circle.width / 2, circle.y - circle.height / 2, circle.width, circle.height);
      };
    }

    circles.push(circle);
  }

  requestAnimationFrame(draw);
}

canvas.addEventListener('click', function(event) {
  var x = event.clientX;
  var y = event.clientY;

  if (images.length > 0) {
    var img = new Image();
    img.onload = function() {
      ctx.drawImage(img, x, y, 200, 200);
    };
    img.src = images[Math.floor(Math.random() * images.length)];
  }
});

function get_random_meme_url() {
  if (images.length === 0) {
    return "https://via.placeholder.com/200";
  }
  const randomIndex = Math.floor(Math.random() * images.length);
  return images[randomIndex].src;
  }