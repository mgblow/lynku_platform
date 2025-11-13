<script setup></script>

<template>
  <svg width="150" height="150" viewBox="0 0 150 150" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="roseGradient" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#ff9ff3"/>
        <stop offset="100%" stop-color="#ff4757"/>
      </radialGradient>
    </defs>
    <g transform="translate(75,75)">
      <path d="M0,0 C10,-30 40,-30 20,0 C40,30 10,30 0,0 Z" fill="url(#roseGradient)">
        <animateTransform attributeName="transform" type="rotate" values="0;10;0;-10;0" dur="2.5s" repeatCount="indefinite"/>
      </path>
      <path d="M0,0 C15,-25 45,-25 25,0 C45,25 15,25 0,0 Z" fill="url(#roseGradient)" opacity="0.8">
        <animateTransform attributeName="transform" type="rotate" values="0;-10;0;10;0" dur="3s" repeatCount="indefinite"/>
      </path>
      <path d="M0,0 C20,-20 50,-20 30,0 C50,20 20,20 0,0 Z" fill="url(#roseGradient)" opacity="0.6">
        <animateTransform attributeName="transform" type="rotate" values="0;15;0;-15;0" dur="3.5s" repeatCount="indefinite"/>
      </path>
    </g>
  </svg>

</template>

<style scoped></style>
