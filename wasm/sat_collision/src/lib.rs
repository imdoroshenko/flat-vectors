pub mod collision;
pub mod vectors;
use crate::collision::detect_collision_sat;
use crate::collision::Polygon;
use crate::vectors::Vector2D;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn detect_collision(poly_a: Vec<f32>, poly_b: Vec<f32>) -> bool {
    // receives two polygons as vectors of floats. Converts them Polygon's
    // and calls the collision detection function.
    detect_collision_sat(&vec_to_poly(&poly_a), &vec_to_poly(&poly_b))
}

#[wasm_bindgen]
pub fn detect_collision_bulk(points: Vec<f32>, polygon_sizes: Vec<u32>) -> Vec<u32> {
    // receives collection of polygons encoded as a single vector of floats
    // and a vector of polygon sizes. Converts them to Polygon's and calls
    // the collision detection function.
    let polys = points_to_polygons(points, polygon_sizes);
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

fn points_to_polygons(points: Vec<f32>, polygon_sizes: Vec<u32>) -> Vec<Polygon> {
    let mut polygons: Vec<Polygon> = Vec::new();
    let mut cursor: u32 = 0;
    for size in polygon_sizes {
        let start_usize: usize = cursor as usize; // Casting u32 to usize.
        let end_usize: usize = (cursor + size) as usize;
        polygons.push(vec_to_poly(&points[start_usize..end_usize]));
        cursor += size;
    }
    polygons
}

fn vec_to_poly(v: &[f32]) -> Polygon {
    let mut poly: Polygon = Vec::new();
    for i in 0..v.len() / 2 {
        poly.push(Vector2D::new(v[i * 2], v[i * 2 + 1]));
    }
    poly
}
