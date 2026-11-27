// The furniture catalogue shown in the sidebar.
//
// width and depth are the footprint of each piece in metres, as seen from
// above, and height is how tall it stands. The 2D plan draws a piece as a
// rectangle of that footprint.
//
// model is the name of the piece's GLTF file in public/models (without
// .glb). The model is scaled to exactly the size given here, so the
// rectangle in 2D is the space it takes up in 3D. Where a model file was in
// the wrong units (some came in centimetres or larger), the size here is a
// real-world one with the model's proportions kept. An item with no model is
// shown in 3D as a simple shape (see furnitureShapes).
//
// turn is for models that were made facing sideways or backwards: how many
// degrees to turn them so their front faces the front of the piece.
// lift is for things that hang on a wall: how high above the floor they sit.

const furniture = [
  {
    name: 'Kitchen',
    items: [
      { id: 'fridge', name: 'Fridge', width: 0.7, depth: 0.7, height: 1.8 },
      { id: 'stove', name: 'Stove', width: 0.6, depth: 0.6, height: 0.9 },
      { id: 'sink-unit', name: 'Sink Unit', width: 1.0, depth: 0.6, height: 0.9 },
      { id: 'counter', name: 'Counter', width: 1.2, depth: 0.6, height: 0.9 },
      { id: 'dining-table-white', name: 'White Dining Table', width: 2.0, depth: 0.88, height: 0.76, model: 'realistic-dining-table' },
      { id: 'dining-table-industrial', name: 'Industrial Dining Table', width: 2.31, depth: 1.16, height: 0.76, model: 'industiral-wooden-table-with-metal-legs' },
      { id: 'pedestal-table', name: 'Pedestal Table', width: 1.22, depth: 1.22, height: 0.75, model: 'rounded-dining-table' },
      { id: 'tulip-table', name: 'Tulip Table', width: 0.71, depth: 0.71, height: 0.75, model: 'dinning-table-01' },
      { id: 'round-table', name: 'Round Table', width: 1.4, depth: 1.4, height: 1.0, model: 'round-wooden-table-01' },
      { id: 'dining-chair', name: 'Dining Chair', width: 0.43, depth: 0.58, height: 0.97, model: 'dining-chair-02' },
      { id: 'upholstered-chair', name: 'Upholstered Chair', width: 0.59, depth: 0.54, height: 0.74, model: 'modern-upholstered-dining-chair' },
      { id: 'wooden-chair', name: 'Wooden Chair', width: 0.57, depth: 0.54, height: 0.9, model: 'modern-chair' },
      { id: 'plastic-chair', name: 'Plastic Chair', width: 0.64, depth: 0.63, height: 0.88, model: 'plastic-monobloc-chair-01' },
      { id: 'stool', name: 'Stool', width: 0.43, depth: 0.44, height: 0.44, model: 'wooden-stool-01' },
    ],
  },
  {
    name: 'Bathroom',
    items: [
      { id: 'toilet', name: 'Toilet', width: 0.4, depth: 0.7, height: 0.75 },
      { id: 'basin', name: 'Basin', width: 0.6, depth: 0.45, height: 0.85 },
      { id: 'bathtub', name: 'Bathtub', width: 1.7, depth: 0.75, height: 0.55 },
      { id: 'shower', name: 'Shower', width: 0.9, depth: 0.9, height: 2.0 },
      { id: 'bath-cabinet', name: 'Cabinet', width: 0.6, depth: 0.35, height: 0.8 },
    ],
  },
  {
    name: 'Living Room',
    items: [
      { id: 'sofa', name: 'Sofa', width: 2.73, depth: 0.93, height: 1.12, model: 'sofa-03' },
      { id: 'grey-couch', name: 'Grey Couch', width: 2.81, depth: 1.14, height: 1.0, model: 'luxury-modern-couch-grey' },
      { id: 'black-leather-couch', name: 'Black Leather Couch', width: 2.75, depth: 0.89, height: 0.82, model: 'modern-couch' },
      { id: 'brown-leather-sofa', name: 'Brown Leather Sofa', width: 3.28, depth: 1.28, height: 0.92, model: 'sofa-model' },
      { id: 'blue-sofa', name: 'Blue Sofa', width: 2.21, depth: 0.98, height: 1.12, model: 'modern-sofa' },
      { id: 'black-sofa', name: 'Black Sofa', width: 1.87, depth: 0.92, height: 0.85, model: 'sofa-1' },
      // this model was saved a little crooked, the small turn straightens it
      { id: 'cream-sofa', name: 'Cream Sofa', width: 2.4, depth: 1.12, height: 1.04, model: 'sofa-3', turn: -10.75 },
      { id: 'brown-loveseat', name: 'Brown Loveseat', width: 1.69, depth: 0.78, height: 1.03, model: 'sofa-2' },
      { id: 'outdoor-sofa-set', name: 'Outdoor Sofa Set', width: 1.73, depth: 2.72, height: 0.85, model: 'modern-industrial-outdoor-sofa-set' },
      { id: 'armchair', name: 'Armchair', width: 0.85, depth: 0.77, height: 1.06, model: 'armchair-01' },
      { id: 'wingback-chair', name: 'Wingback Chair', width: 0.87, depth: 0.78, height: 1.1, model: 'living-room-sofa-furniture' },
      { id: 'tub-chair', name: 'White Tub Chair', width: 1.01, depth: 0.8, height: 0.85, model: 'muwanga-snow-white-soft-sofa' },
      { id: 'modern-chair', name: 'Modern Chair', width: 0.58, depth: 0.63, height: 0.85, model: 'generic-modern-chair' },
      { id: 'rocking-chair', name: 'Rocking Chair', width: 0.71, depth: 0.83, height: 1.0, model: 'rockingchair-01' },
      { id: 'coffee-table', name: 'Coffee Table', width: 0.6, depth: 1.2, height: 0.39, model: 'modern-coffee-table-01' },
      { id: 'tv-unit', name: 'TV Unit', width: 2.44, depth: 0.52, height: 0.68, model: 'modern-wooden-cabinet' },
    ],
  },
  {
    name: 'Bedroom',
    items: [
      { id: 'double-bed', name: 'Double Bed', width: 1.49, depth: 2.04, height: 1.53, model: 'gothicbed-01' },
      { id: 'day-bed', name: 'Day Bed', width: 1.97, depth: 0.85, height: 1.13, model: 'vintage-day-bed' },
      { id: 'dresser', name: 'Dresser', width: 1.72, depth: 1.01, height: 1.09, model: 'vintage-wooden-drawer-01' },
      { id: 'antique-wardrobe', name: 'Antique Wardrobe', width: 1.35, depth: 0.82, height: 1.97, model: 'antique-wooden-wardrobe' },
      { id: 'classic-wardrobe', name: 'Classic Wardrobe', width: 1.5, depth: 0.56, height: 2.35, model: 'low-poly-classic-wooden-wardrobe' },
      { id: 'red-door-wardrobe', name: 'Red Door Wardrobe', width: 1.55, depth: 0.97, height: 2.0, model: 'wardrobe' },
      { id: 'glass-panel-wardrobe', name: 'Glass Panel Wardrobe', width: 1.34, depth: 0.72, height: 2.1, model: 'wardrobe-with-glass-panel-and-open-shelf' },
      { id: 'luxury-wardrobe', name: 'Luxury Wardrobe', width: 2.01, depth: 0.95, height: 2.2, model: 'luxury-wardrobe-closet-for-modern-interiors', turn: 180 },
      { id: 'hanger-wardrobe', name: 'Wardrobe with Hangers', width: 2.02, depth: 0.55, height: 1.9, model: 'wooden-wardrobe-with-hangers-inside-free', turn: -90 },
      { id: 'grey-closet', name: 'Grey Closet', width: 1.11, depth: 0.67, height: 1.89, model: 'wardrobecloset-in-low-poly', turn: 180 },
      { id: 'kids-wardrobe', name: 'Kids Wardrobe', width: 1.5, depth: 0.46, height: 2.4, model: 'girls-wardrobe-kids-closet' },
      { id: 'bedside-table', name: 'Bedside Table', width: 0.45, depth: 0.45, height: 0.5 },
    ],
  },
  {
    name: 'Storage',
    items: [
      { id: 'tall-cabinet', name: 'Tall Cabinet', width: 1.71, depth: 0.62, height: 2.18, model: '3d-wooden-cabinet', turn: -90 },
      { id: 'wooden-cupboard', name: 'Wooden Cupboard', width: 0.91, depth: 0.37, height: 1.33, model: 'wooden-cupboard-with-door' },
      { id: 'steel-shelves', name: 'Steel Shelves', width: 1.1, depth: 0.5, height: 2.14, model: 'steel-frame-shelves-01' },
      { id: 'display-shelves', name: 'Display Shelves', width: 0.37, depth: 1.08, height: 1.56, model: 'wooden-display-shelves-01' },
    ],
  },
  {
    name: 'Desks',
    items: [
      { id: 'study-desk', name: 'Study Desk', width: 1.13, depth: 0.71, height: 0.8, model: 'wooden-table-02' },
      { id: 'office-desk', name: 'Office Desk', width: 1.5, depth: 0.75, height: 0.75 },
      { id: 'corner-desk', name: 'Corner Desk', width: 1.4, depth: 1.4, height: 0.75 },
      { id: 'office-chair', name: 'Office Chair', width: 0.6, depth: 0.6, height: 0.9 },
    ],
  },
  {
    name: 'Accessories - Deco',
    items: [
      { id: 'tall-plant', name: 'Tall Plant', width: 0.59, depth: 0.63, height: 1.34, model: 'potted-plant-01' },
      { id: 'bushy-plant', name: 'Bushy Plant', width: 0.7, depth: 0.66, height: 0.84, model: 'potted-plant-02' },
      { id: 'small-plant', name: 'Small Plant', width: 0.17, depth: 0.18, height: 0.27, model: 'potted-plant-04' },
      { id: 'wall-clock', name: 'Wall Clock', width: 0.32, depth: 0.08, height: 0.32, model: 'wall-clock', lift: 1.8 },
      { id: 'picture-frame', name: 'Picture Frame', width: 0.75, depth: 0.08, height: 0.5, model: 'hanging-picture-frame-02', lift: 1.3 },
      { id: 'rug', name: 'Rug', width: 2.0, depth: 1.4, height: 0.02 },
      { id: 'floor-lamp', name: 'Floor Lamp', width: 0.4, depth: 0.4, height: 1.6 },
      { id: 'side-table', name: 'Side Table', width: 0.5, depth: 0.5, height: 0.5 },
      { id: 'mirror', name: 'Mirror', width: 0.8, depth: 0.1, height: 1.7 },
    ],
  },
]

export default furniture
