<script setup></script>

<template>
  <svg width="120" height="120" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
    <g transform="translate(60,60)">
      <!-- radial spark lines -->
      <line x1="0" y1="0" x2="0" y2="-40" stroke="#ff4757" stroke-width="2">
        <animateTransform attributeName="transform" type="rotate" values="0;360" dur="1s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="1;0;1" dur="1s" repeatCount="indefinite"/>
      </line>
      <line x1="0" y1="0" x2="0" y2="-40" stroke="#ff9ff3" stroke-width="2" transform="rotate(45)">
        <animateTransform attributeName="transform" type="rotate" values="45;405" dur="1s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="1;0;1" dur="1s" repeatCount="indefinite"/>
      </line>
      <line x1="0" y1="0" x2="0" y2="-40" stroke="#ffeaa7" stroke-width="2" transform="rotate(90)">
        <animateTransform attributeName="transform" type="rotate" values="90;450" dur="1s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="1;0;1" dur="1s" repeatCount="indefinite"/>
      </line>
      <line x1="0" y1="0" x2="0" y2="-40" stroke="#2ed573" stroke-width="2" transform="rotate(135)">
        <animateTransform attributeName="transform" type="rotate" values="135;495" dur="1s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="1;0;1" dur="1s" repeatCount="indefinite"/>
      </line>
    </g>
  </svg>

</template>

<style scoped></style>
