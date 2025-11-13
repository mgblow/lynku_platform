<script setup></script>

<template>
  <svg width="120" height="120" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
    <g transform="translate(60,60)">
      <circle cx="0" cy="0" r="10" fill="#FFD700"/>
      <g>
        <circle cx="0" cy="-20" r="10" fill="#FF6B81">
          <animateTransform attributeName="transform" type="scale" values="1;1.2;1" dur="2s" repeatCount="indefinite"/>
        </circle>
        <circle cx="14" cy="-14" r="10" fill="#FF6B81">
          <animateTransform attributeName="transform" type="scale" values="1;1.2;1" dur="2s" repeatCount="indefinite"/>
        </circle>
        <circle cx="20" cy="0" r="10" fill="#FF6B81">
          <animateTransform attributeName="transform" type="scale" values="1;1.2;1" dur="2s" repeatCount="indefinite"/>
        </circle>
        <circle cx="14" cy="14" r="10" fill="#FF6B81">
          <animateTransform attributeName="transform" type="scale" values="1;1.2;1" dur="2s" repeatCount="indefinite"/>
        </circle>
        <circle cx="0" cy="20" r="10" fill="#FF6B81">
          <animateTransform attributeName="transform" type="scale" values="1;1.2;1" dur="2s" repeatCount="indefinite"/>
        </circle>
        <circle cx="-14" cy="14" r="10" fill="#FF6B81">
          <animateTransform attributeName="transform" type="scale" values="1;1.2;1" dur="2s" repeatCount="indefinite"/>
        </circle>
        <circle cx="-20" cy="0" r="10" fill="#FF6B81">
          <animateTransform attributeName="transform" type="scale" values="1;1.2;1" dur="2s" repeatCount="indefinite"/>
        </circle>
        <circle cx="-14" cy="-14" r="10" fill="#FF6B81">
          <animateTransform attributeName="transform" type="scale" values="1;1.2;1" dur="2s" repeatCount="indefinite"/>
        </circle>
      </g>
    </g>
  </svg>
</template>

<style scoped></style>
