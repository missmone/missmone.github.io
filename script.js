const validTrackingCode = 'DEMO-CA-GR-20261018-4827';

const shipmentProgress = [
  {
    status: 'Awaiting Simulated Pickup',
    location: 'California, USA',
    note: 'Shipment is prepared and waiting for collection.'
  },
  {
    status: 'In Transit to Port',
    location: 'California, USA',
    note: 'Cargo is moving through the assigned onward logistics route.'
  },
  {
    status: 'Departed Origin',
    location: 'International Route',
    note: 'The shipment has departed the origin hub and is in transit.'
  },
  {
    status: 'Arrived in Athens',
    location: 'Athens, Greece',
    note: 'The shipment has reached the destination area and is awaiting final handoff.'
  }
];

const trackingForm = document.getElementById('tracking-form');
const trackingInput = document.getElementById('tracking-code');
const trackingMessage = document.getElementById('tracking-message');
const shipmentSection = document.getElementById('shipment-details');
const advanceStatusButton = document.getElementById('advance-status');

let currentStep = 0;

function renderShipment(stepIndex) {
  const current = shipmentProgress[stepIndex];
  const statusBadge = document.getElementById('display-status');

  document.getElementById('display-location').textContent = current.location;
  document.getElementById('display-status').textContent = current.status;
  statusBadge.style.background = stepIndex >= 3 ? 'var(--success-soft)' : 'var(--warning-soft)';
  statusBadge.style.color = stepIndex >= 3 ? '#0d7b4c' : '#915e00';
  statusBadge.style.borderColor = stepIndex >= 3 ? 'rgba(28, 154, 87, 0.22)' : 'rgba(186, 125, 28, 0.18)';
}

function showShipment() {
  shipmentSection.classList.remove('hidden');
  shipmentSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  renderShipment(currentStep);
}

trackingForm.addEventListener('submit', function (event) {
  event.preventDefault();

  const enteredCode = trackingInput.value.trim();

  if (enteredCode === validTrackingCode) {
    trackingMessage.textContent = 'Shipment found. Loading routing details.';
    trackingMessage.className = 'tracking-message success';
    currentStep = 0;
    showShipment();
    trackingInput.value = '';
  } else {
    trackingMessage.textContent = 'Tracking code not recognised. Please check the number and try again.';
    trackingMessage.className = 'tracking-message error';
    shipmentSection.classList.add('hidden');
  }
});

advanceStatusButton.addEventListener('click', function () {
  if (shipmentSection.classList.contains('hidden')) {
    return;
  }

  currentStep = (currentStep + 1) % shipmentProgress.length;
  renderShipment(currentStep);
});
