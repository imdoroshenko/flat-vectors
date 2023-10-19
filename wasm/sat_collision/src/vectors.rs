pub struct Vector2D {
    x: f32,
    y: f32,
}

impl Vector2D {
    pub fn new(x: f32, y: f32) -> Vector2D {
        Vector2D { x, y }
    }

    pub fn add(&self, b: &Vector2D) -> Vector2D {
        Vector2D {
            x: self.x + b.x,
            y: self.y + b.y,
        }
    }

    pub fn sub(&self, b: &Vector2D) -> Vector2D {
        Vector2D {
            x: self.x - b.x,
            y: self.y - b.y,
        }
    }

    pub fn magnitude(&self) -> f32 {
        (self.x * self.x + self.y * self.y).sqrt()
    }

    pub fn dot(&self, a: &Vector2D) -> f32 {
        self.x * a.x + self.y * a.y
    }

    pub fn normalized(&self) -> Vector2D {
        let mag = self.magnitude();
        Vector2D {
            x: self.x / mag,
            y: self.y / mag,
        }
    }

    pub fn rotate(&self, angle: f32) -> Vector2D {
        Vector2D {
            x: self.x * angle.cos() - self.y * angle.sin(),
            y: self.x * angle.sin() + self.y * angle.cos(),
        }
    }
}
