const phrasesContainer = document.querySelector('.phrases-container');
const title = 'Beauty in Student Chaos';
const phrasesToShow = 60;
const maxWordsPerPhrase = 14;
let clickedCount = 0;

const getRandomPosition = () => {
  const x = Math.floor(Math.random() * (window.innerWidth - 200));
  const y = Math.floor(Math.random() * (window.innerHeight - 50));
  return { x, y };
};

const getRandomVelocity = () => {
  const speed = Math.floor(Math.random() * 5) + 5;
  const angle = Math.random() * Math.PI * 2;
  const vx = Math.cos(angle) * speed;
  const vy = Math.sin(angle) * speed;
  return { vx, vy };
};

const getRedditPosts = (subreddit, sorting) => {
  const url = `https://www.reddit.com/r/${subreddit}/${sorting}.json`;
  return fetch(url)
    .then(response => response.json())
    .then(data => {
      const titles = data.data.children.map(child => child.data.title);
      return titles.filter(title => title.split(' ').length <= maxWordsPerPhrase);
    })
    .catch(error => {
      console.error(`Error fetching Reddit posts: ${error}`);
      return [];
    });
};

const addPhrases = async () => {
  const phrases = await getRedditPosts('college', 'top');
  const numPhrasesToShow = Math.min(phrases.length, phrasesToShow);

  for (let i = 0; i < numPhrasesToShow; i++) {
    const position = getRandomPosition();
    const velocity = getRandomVelocity();

    const phraseElement = document.createElement('div');
    phraseElement.classList.add('phrase');
    phraseElement.textContent = phrases[i].split(' ').slice(0, maxWordsPerPhrase).join(' ');
    phraseElement.style.left = `${position.x}px`;
    phraseElement.style.top = `${position.y}px`;
    phraseElement.dataset.vx = velocity.vx;
    phraseElement.dataset.vy = velocity.vy;
    phraseElement.addEventListener('click', () => {
      phraseElement.remove();
      clickedCount++;
      updateVisibility();
    });

    phrasesContainer.appendChild(phraseElement);
  }
};

const updatePhrases = () => {
  const phraseElements = document.querySelectorAll('.phrase');
  phraseElements.forEach(phraseElement => {
    const vx = Number(phraseElement.dataset.vx);
    const vy = Number(phraseElement.dataset.vy);
    const x = Number(phraseElement.style.left.replace('px', ''));
    const y = Number(phraseElement.style.top.replace('px', ''));

    let newX = x + vx;
    let newY = y + vy;

    if (newX < 0 || newX > window.innerWidth - 200) {
      phraseElement.dataset.vx = -vx;
      newX = x - vx;
    }

    if (newY < 0 || newY > window.innerHeight - 50) {
      phraseElement.dataset.vy = -vy;
      newY = y - vy;
    }

    phraseElement.style.left = `${newX}px`;
    phraseElement.style.top = `${newY}px`;
  });
};

const updateVisibility = () => {
  const opacity = clickedCount / phrasesToShow;
  const titleElement = document.querySelector('.title');
  const backgroundElement = document.querySelector('.background');
  titleElement.style.opacity = 1 - opacity;
  background

}
const startAnimation = async () => {
  await addPhrases();
  
  setInterval(() => {
    updatePhrases();
  }, 50);
};

startAnimation();

