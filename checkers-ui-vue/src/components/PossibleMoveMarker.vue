<template>
    <div class="legal-move" />
</template>
<style lang="scss" scoped>
@use 'sass:color';

.legal-move {
    width: calc($pieceSize / 2);
    height: calc($pieceSize / 2);
    border-radius: 50%;
    background-color: color.mix(aqua, violet);
    border: 1.5px solid black;
}

@media (max-width: 700px) {
    .legal-move {
        border-width: 1.2px;
    }
}
</style>