pub mod collision;
pub mod vectors;
extern crate web_sys;
use crate::collision::detect_collision_sat;
use crate::collision::Polygon2;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn detect_collision(poly_a: Vec<f32>, poly_b: Vec<f32>) -> bool {
    // receives two polygons as vectors of floats. Converts them Polygon's
    // and calls the collision detection function.
    detect_collision_sat(
        &mut Polygon2::from_slice(&poly_a[..]),
        &mut Polygon2::from_slice(&poly_b[..]),
    )
}

#[wasm_bindgen]
pub fn detect_collision_bulk(points: Vec<f32>, polygon_sizes: Vec<u32>) -> Vec<u32> {
    // receives collection of polygons encoded as a single vector of floats
    // and a vector of polygon sizes. Converts them to Polygon's and calls
    // the collision detection function.
    let polys = Polygon2::from_slice_bulk(&points[..], &polygon_sizes[..]);
    let mut collisions = Vec::new();
    for a in 0..polys.len() {
        for b in a + 1..polys.len() {
            if detect_collision_sat(&polys[a], &polys[b]) {
                collisions.push(a as u32);
                collisions.push(b as u32);
            }
        }
    }
    return collisions;
}
