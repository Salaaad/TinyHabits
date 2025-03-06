let selectedEmoji = null;
let isDragging = false;
let draggedEmoji = null;
let contextMenu = null; // Menu contextuel
let currentEmoji = null; // Emoji actuellement sélectionné pour afficher le menu

// Fonction pour afficher le menu contextuel
function showContextMenu(e, emoji) {
  e.preventDefault(); // Empêcher le comportement par défaut (sélection de texte)
  currentEmoji = emoji;

  // Positionner le menu contextuel où l'utilisateur a cliqué
  contextMenu.style.left = `${e.clientX}px`;
  contextMenu.style.top = `${e.clientY}px`;

  // Afficher le menu contextuel
  contextMenu.style.display = 'block';

  // Mettre à jour la taille du champ input selon la taille actuelle de l'emoji
  const currentSize = parseInt(window.getComputedStyle(currentEmoji).fontSize);
  document.getElementById('emoji-size').value = currentSize; // Mise à jour de l'input
}

// Fonction pour cacher le menu contextuel
function hideContextMenu() {
  contextMenu.style.display = 'none';
}

// Fonction pour changer la taille de l'emoji
function changeSize(e) {
  const newSize = e.target.value; // Nouvelle taille depuis le champ input
  if (currentEmoji) {
    console.log('Nouvelle taille appliquée:', newSize); // Log pour déboguer
    currentEmoji.style.fontSize = `${newSize}px`; // Modifier la taille de l'emoji en temps réel
  }
}

// Fonction pour supprimer l'emoji
function deleteEmoji() {
  if (currentEmoji) {
    currentEmoji.remove();
    hideContextMenu(); // Cacher le menu après suppression
  }
}

// Créer un emoji quand on clique sur le bouton du menu
function createEmoji(event) {
  if (selectedEmoji === null) return; // Ne pas ajouter si aucun emoji n'est sélectionné

  // Créer un nouvel élément emoji et le positionner au centre de la carte
  const emojiElement = document.createElement('div');
  emojiElement.classList.add('emoji');
  emojiElement.innerHTML = selectedEmoji;

  // Par défaut, donner une taille initiale
  emojiElement.style.fontSize = '50px'; // Taille par défaut

  // Positionner l'emoji au centre de la page
  emojiElement.style.left = `${event.clientX - emojiElement.offsetWidth / 2}px`;
  emojiElement.style.top = `${event.clientY - emojiElement.offsetHeight / 2}px`;

  // Ajouter l'emoji à la page
  document.body.appendChild(emojiElement);

  // Ajouter l'événement de clic pour afficher le menu contextuel
  emojiElement.addEventListener('click', function(e) {
    showContextMenu(e, emojiElement);
  });

  // Rendre l'emoji déplaçable
  emojiElement.addEventListener('mousedown', startDrag);
}

// Déplacer l'emoji
function startDrag(e) {
  isDragging = true;
  draggedEmoji = e.target;

  const offsetX = e.clientX - draggedEmoji.getBoundingClientRect().left;
  const offsetY = e.clientY - draggedEmoji.getBoundingClientRect().top;

  function drag(e) {
    draggedEmoji.style.left = `${e.clientX - offsetX}px`;
    draggedEmoji.style.top = `${e.clientY - offsetY}px`;
  }

  function stopDrag() {
    isDragging = false;
    draggedEmoji = null;
    document.removeEventListener('mousemove', drag);
    document.removeEventListener('mouseup', stopDrag);
  }

  document.addEventListener('mousemove', drag);
  document.addEventListener('mouseup', stopDrag);
}

// Sélectionner quel emoji utiliser à partir du menu
document.getElementById('emoji-water').addEventListener('click', function(e) {
  e.preventDefault(); // Empêche le comportement par défaut du lien
  selectedEmoji = '💧';
  createEmoji(e); // Créer l'emoji à l'endroit où on a cliqué
});

document.getElementById('emoji-coffee').addEventListener('click', function(e) {
  e.preventDefault();
  selectedEmoji = '☕';
  createEmoji(e);
});

document.getElementById('emoji-dog').addEventListener('click', function(e) {
  e.preventDefault();
  selectedEmoji = '🐶';
  createEmoji(e);
});

// Créer un menu contextuel pour chaque emoji
document.addEventListener('DOMContentLoaded', function() {
  // Créer le menu contextuel
  contextMenu = document.createElement('div');
  contextMenu.classList.add('context-menu');

  // Ajouter une option de changement de taille
  const sizeControl = document.createElement('div');
  sizeControl.innerHTML = `
    <span>$$$</span>
    <input type="number" id="emoji-size" value="50" min="10" max="200" />
  `;
  contextMenu.appendChild(sizeControl);

  // Ajouter une option de suppression
  const deleteOption = document.createElement('a');
  deleteOption.href = "#";
  deleteOption.innerText = "❌";
  deleteOption.addEventListener('click', deleteEmoji);
  contextMenu.appendChild(deleteOption);

  // Ajouter le menu contextuel à la page
  document.body.appendChild(contextMenu);

  // Appliquer l'événement pour modifier la taille
  document.getElementById('emoji-size').addEventListener('input', changeSize);
});

// Cacher le menu contextuel quand on clique ailleurs
document.addEventListener('click', function(e) {
  if (!e.target.closest('.emoji') && !e.target.closest('.context-menu')) {
    hideContextMenu();
  }
});
