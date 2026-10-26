const validTrackingCode = 'DEMO-CA-GR-20261018-4827';

const shipmentProgress = [
  {
    status: 'Pickup scheduled',
    location: 'California, USA',
    route: 'California → Los Angeles gateway',
    update: 'Collection window confirmed',
    note: 'Shipment is prepared for pickup and ready for onward dispatch.'
  },
  {
    status: 'Origin departure',
    location: 'Los Angeles, USA',
    route: 'Los Angeles → Port of Long Beach',
    update: 'Cargo released to the assigned transport lane',
    note: 'The shipment has moved from the origin point and is being routed to the next hub.'
  },
  {
    status: 'International transit',
    location: 'Atlantic / Mediterranean route',
    route: 'Long Beach → Port of Piraeus',
    update: 'Transit continues along the international freight corridor',
    note: 'Cargo is progressing through the planned international route with live coordination.'
  },
  {
    status: 'Arrival at destination gateway',
    location: 'Thessaloniki, Greece',
    route: 'Port of Piraeus → Thessaloniki',
    update: 'Shipment reached the destination gateway for final handling',
    note: 'The consignment has arrived in the destination region and is awaiting local delivery planning.'
  }
];

const trackingForm = document.getElementById('tracking-form');
const trackingInput = document.getElementById('tracking-code');
const trackingMessage = document.getElementById('tracking-message');
const shipmentSection = document.getElementById('shipment-details');
const advanceStatusButton = document.getElementById('advance-status');
const statusTimeline = document.getElementById('status-timeline');

let currentStep = 0;

function hideShipment() {
  if (shipmentSection) {
    shipmentSection.classList.add('hidden');
  }
}

function renderTimeline() {
  if (!statusTimeline) return;

  statusTimeline.innerHTML = shipmentProgress
    .map((item, index) => {
      const isActive = index <= currentStep;
      return `
        <li class="${isActive ? 'active' : ''}">
          <div>
            <strong>${item.status}</strong>
            <span>${item.update}</span>
          </div>
        </li>
      `;
    })
    .join('');
}

function renderShipment(stepIndex) {
  const current = shipmentProgress[stepIndex];
  const statusBadge = document.getElementById('display-status');

  if (!current || !statusBadge) return;

  document.getElementById('display-location').textContent = current.location;
  document.getElementById('display-status').textContent = current.status;
  document.getElementById('display-route').textContent = current.route;
  document.getElementById('display-last-update').textContent = current.update;

  const isArrival = stepIndex >= shipmentProgress.length - 1;
  statusBadge.style.background = isArrival ? 'var(--success-soft)' : 'var(--warning-soft)';
  statusBadge.style.color = isArrival ? '#0d7b4c' : '#915e00';
  statusBadge.style.borderColor = isArrival ? 'rgba(28, 154, 87, 0.22)' : 'rgba(186, 125, 28, 0.18)';

  renderTimeline();
}

function showShipment() {
  if (!shipmentSection) return;
  shipmentSection.classList.remove('hidden');
  shipmentSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  renderShipment(currentStep);
}

function handleTrackingSubmit(event) {
  event.preventDefault();

  const enteredCode = (trackingInput && trackingInput.value ? trackingInput.value.trim() : '');
  const queryString = new URLSearchParams(window.location.search);
  const paramCode = queryString.get('tracking') || queryString.get('tracking-number') || '';
  const normalizedCode = enteredCode || paramCode;

  if (normalizedCode !== validTrackingCode) {
    trackingMessage.textContent = 'Incorrect tracking code. Please use the valid shipment reference.';
    trackingMessage.className = 'tracking-message error';
    hideShipment();
    return;
  }

  trackingMessage.textContent = 'Shipment found. Loading routing details.';
  trackingMessage.className = 'tracking-message success';
  currentStep = 0;
  trackingInput.value = validTrackingCode;
  showShipment();
}

if (trackingForm) {
  trackingForm.addEventListener('submit', handleTrackingSubmit);
}

if (advanceStatusButton) {
  advanceStatusButton.addEventListener('click', function () {
    if (shipmentSection && shipmentSection.classList.contains('hidden')) {
      return;
    }

    currentStep = (currentStep + 1) % shipmentProgress.length;
    renderShipment(currentStep);
  });
}

function initializeTrackingFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const trackingParam = params.get('tracking') || params.get('tracking-number');

  if (trackingParam) {
    trackingInput.value = trackingParam;
  }

  hideShipment();
  renderTimeline();
}

initializeTrackingFromUrl();
