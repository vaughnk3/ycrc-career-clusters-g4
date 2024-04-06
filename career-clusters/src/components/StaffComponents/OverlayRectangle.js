/*
    This component represents an overlay rectangle, often used as a backdrop
    for pop-up dialogs or modal windows. It creates a translucent layer
    covering the entire viewport to focus user attention on specific content.

    The overlay is styled using the "overlay" class defined in the associated
    CSS file.

    Component structure:
    - It consists of a <div> element with the "overlay" class applied to it.

    LAST EDITED 04/05/2024 Gavin T. Anderson
*/

import './OverlayRectangle.css'; // Importing the associated CSS file

const OverlayRectangle = () => {
    return (
        <div className="overlay"></div> // Rendering the overlay <div> with the "overlay" class
    );
}

export default OverlayRectangle;
