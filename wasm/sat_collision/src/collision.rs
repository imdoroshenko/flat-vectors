use crate::vectors::Vector2D;

pub type Polygon = Vec<Vector2D>;

pub fn detect_collision_sat(a: &Polygon, b: &Polygon) -> bool {
    let mut axes: Vec<Vector2D> = Vec::new();
    axes.extend(get_axes(&a));
    axes.extend(get_axes(&b));
    for axis in axes {
        let mut a_min = f32::INFINITY;
        let mut a_max = f32::NEG_INFINITY;
        let mut b_min = f32::INFINITY;
        let mut b_max = f32::NEG_INFINITY;
        for point in a {
            let projection = point.dot(&axis);
            a_min = a_min.min(projection);
            a_max = a_max.max(projection);
        }
        for point in b {
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

pub fn get_axes(p: &Polygon) -> Vec<Vector2D> {
    let mut axes: Vec<Vector2D> = Vec::new();
    for i in 0..p.len() {
        let p1 = &p[i];
        let p2 = &p[(i + 1) % p.len()];
        axes.push(p1.sub(p2).rotate(std::f32::consts::FRAC_PI_2));
    }
    axes
}
