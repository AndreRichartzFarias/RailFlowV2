<script setup>
</script>

<template>
  <div class="map-container">
    <iframe
      src="https://www.google.com/maps?q=Joinville&z=12&output=embed"
      width="100%"
      height="100%"
      style="border:0;"
      allowfullscreen
      loading="lazy"
      referrerpolicy="no-referrer-when-downgrade"
    ></iframe>
  </div>
</template>

<style scoped>
.map-container {
  width: 100vw;
  height: 70vh;
  max-width: 100%;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  border-top: solid rgba(0, 0, 0, 0.267) 1px;
  border-bottom: solid rgba(0, 0, 0, 0.267) 1px;
}
iframe {
  box-shadow: 0 2px 16px 0 rgba(0,0,0,0.08);
}
</style>