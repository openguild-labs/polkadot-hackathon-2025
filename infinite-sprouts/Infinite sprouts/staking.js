// Function to show a section by toggling the active section class
function showSection(sectionId) {
  // Hide all sections by removing the 'active-section' class
  document.querySelectorAll('.section').forEach(section => {
      section.classList.remove('active-section');
  });

  // Add the 'active-section' class to the selected section
  const targetSection = document.getElementById(sectionId);
  if (targetSection) {
      targetSection.classList.add('active-section');
  }

  // Remove the 'active' class from all buttons
  document.querySelectorAll('.section-buttons button').forEach(button => {
      button.classList.remove('active');
  });

  // Add 'active' class to the clicked button
  document.querySelector(`button[onclick="showSection('${sectionId}')"]`).classList.add('active');
}

// Function to show the stake popup
function showStakePopup(action, plan, amount) {
  const modal = document.getElementById('stakeModal');
  document.getElementById('stakeMessage').innerText = `${action}: ${plan} ($${amount})`;
  openModal(modal);
}

// Function to show the extend popup
function showExtendPopup(plan, duration) {
  const modal = document.getElementById('extendModal');
  document.getElementById('extendPlanName').innerText = `${plan} (${duration} Days)`;
  openModal(modal);
}

// Function to show the end popup
function showEndPopup(plan) {
  const modal = document.getElementById('endModal');
  document.getElementById('endPlanName').innerText = plan;
  openModal(modal);
}

// Function to open the modal
function openModal(modal) {
  modal.style.display = 'flex';
}

// Function to close the modal
function closeModal() {
  document.querySelectorAll('.modal').forEach(modal => modal.style.display = 'none');
}

// Confirmation functions for modals
function confirmStake() {
  alert('Stake Confirmed!');
  closeModal();
}

function confirmExtend() {
  alert('Stake Extended!');
  closeModal();
}

function confirmEnd() {
  alert('Stake Ended!');
  closeModal();
}

// Function to show the selected tab content
function showTabContentById(tabId) {
  // Hide all tab content sections
  document.querySelectorAll('.tab-content').forEach(content => {
      content.classList.remove('active');
  });

  // Show the target content by adding 'active' class
  const tabContent = document.getElementById(tabId);
  if (tabContent) {
      tabContent.classList.add('active');
  }
}

// Add event listener to each tab button to switch tabs
document.querySelectorAll('.tab-button').forEach(button => {
  button.addEventListener('click', () => {
      // Remove 'active' class from all tab buttons
      document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));

      // Add 'active' class to the clicked button
      button.classList.add('active');

      // Get the target tab content ID from the data-target attribute of the clicked button
      const targetContentId = button.dataset.target;

      // Show the content of the clicked tab
      showTabContentById(targetContentId);
  });
});

// Set the default section on page load
window.addEventListener('DOMContentLoaded', () => {
  // Set the default section to be "staking"
  showSection('staking'); // Display the default "Staking" section
});


