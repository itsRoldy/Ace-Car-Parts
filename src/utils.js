export const setNewOffset = (card, mouseMoveDir, padding = {x:0, y:0}) => {
    const offsetLeft = card.offsetLeft - mouseMoveDir.x
    const offsetTop = card.offsetTop - mouseMoveDir.y

    return {
        x:offsetLeft < 0 ? 0 :offsetLeft,
        y:offsetTop < 0 ? 0 :offsetTop,
    }
}

export const snapToGrid = (card, padding, gridSize) => {

    const snappedX = Math.round(card.offsetLeft / gridSize) * gridSize + parseInt(padding)
    const snappedY = Math.round(card.offsetTop  / gridSize) * gridSize + parseInt(padding)

    card.style.left = `${snappedX}px`
    card.style.top = `${snappedY}px`
}

export function autoGrow(textAreaRef) {
    const { current } = textAreaRef;
    current.style.height = "auto"; // Reset the height
    current.style.height = textAreaRef.current.scrollHeight + "px"; // Set the new height
}

export const setZIndex = (selectedCard) => {
    selectedCard.style.zIndex = 999;
 
    Array.from(document.getElementsByClassName("card")).forEach((card) => {
        if (card !== selectedCard) {
            card.style.zIndex = selectedCard.style.zIndex - 1;
        }
    });
};