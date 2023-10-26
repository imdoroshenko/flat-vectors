use crate::vectors::Vector2D;
use std::cell::OnceCell;
pub type Polygon = Vec<Vector2D>;

pub struct Polygon2 {
    pub points: Vec<Vector2D>,
    pub axes: OnceCell<Vec<Vector2D>>,
}

impl Polygon2 {
    pub fn new(points: Vec<Vector2D>) -> Polygon2 {
        Polygon2 {
            axes: OnceCell::new(),
            points,
        }
    }

    pub fn axes(&self) -> &Vec<Vector2D> {
        self.axes
            .get_or_init(|| Polygon2::calculate_axes(&self.points))
    }

    pub fn from_slice_bulk(points: &[f32], polygon_sizes: &[u32]) -> Vec<Polygon2> {
        let mut polygons: Vec<Polygon2> = Vec::new();
        let mut cursor: u32 = 0;
        for size in polygon_sizes {
            let start_usize: usize = cursor as usize; // Casting u32 to usize.
            let end_usize: usize = (cursor + size) as usize;
            polygons.push(Polygon2::from_slice(&points[start_usize..end_usize]));
            cursor += size;
        }
        polygons
    }

    pub fn from_slice(points: &[f32]) -> Polygon2 {
        let mut poly: Polygon = Vec::new();
        for i in 0..points.len() / 2 {
            poly.push(Vector2D::new(points[i * 2], points[i * 2 + 1]));
        }
        Polygon2::new(poly)
    }
    fn calculate_axes(points: &Vec<Vector2D>) -> Vec<Vector2D> {
        let mut axes: Vec<Vector2D> = Vec::new();
        for i in 0..points.len() {
            let p1 = &points[i];
            let p2 = &points[(i + 1) % points.len()];
            axes.push(p1.sub(p2).normal());
        }
        axes
    }
}

pub fn detect_collision_sat(a: &Polygon2, b: &Polygon2) -> bool {
    let mut axes: Vec<&Vector2D> = Vec::new();
    axes.extend(a.axes());
    axes.extend(b.axes());
    for axis in axes {
        let mut a_min = f32::INFINITY;
        let mut a_max = f32::NEG_INFINITY;
        let mut b_min = f32::INFINITY;
        let mut b_max = f32::NEG_INFINITY;
        for point in a.points.iter() {
            let projection = point.dot(&axis);
            a_min = a_min.min(projection);
            a_max = a_max.max(projection);
        }
        for point in b.points.iter() {
            let projection = point.dot(&axis);
            b_min = b_min.min(projection);
            b_max = b_max.max(projection);
        }
        if a_max < b_min || b_max < a_min {
            return false;
        }
    }
    true
}
