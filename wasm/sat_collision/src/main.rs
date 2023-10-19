pub mod collision;
pub mod vectors;

use crate::collision::detect_collision_sat;
use crate::collision::Polygon;
use crate::vectors::Vector2D;

fn main() {
    println!("Hello, world!");
    test()
}

fn test() {
    let mut triangle1 = Polygon::new();
    triangle1.push(Vector2D::new(0.0, 0.0));
    triangle1.push(Vector2D::new(1.0, 0.0));
    triangle1.push(Vector2D::new(0.0, 1.0));

    let mut triangle2 = Polygon::new();
    triangle2.push(Vector2D::new(0.5, 0.5));
    triangle2.push(Vector2D::new(1.5, 0.5));
    triangle2.push(Vector2D::new(0.5, 1.5));

    let mut triangle3 = Polygon::new();
    triangle3.push(Vector2D::new(2.0, 2.0));
    triangle3.push(Vector2D::new(3.0, 2.0));
    triangle3.push(Vector2D::new(2.0, 3.0));

    print!("{}", detect_collision_sat(&triangle1, &triangle2));
    print!("{}", detect_collision_sat(&triangle1, &triangle3));
}
