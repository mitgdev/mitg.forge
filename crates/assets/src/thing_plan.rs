use anyhow::{Result, anyhow};
use serde::{Deserialize, Serialize};

use crate::protobuf::{Appearances, FixedFrameGroup};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RenderPlan {
    pub kind: &'static str, // Object
    pub id: u32,

    pub pattern_width: u32,
    pub pattern_height: u32,
    pub pattern_depth: u32,
    pub layers: u32,

    pub frames: Vec<RenderFrame>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RenderFrame {
    pub duration_ms: u32,
    pub sprite_ids: Vec<u32>,
}

pub fn build_object_render_plan(appearances: &Appearances, object_id: u32) -> Result<RenderPlan> {
    let appearance = appearances
        .object
        .iter()
        .find(|x| x.id.unwrap_or(0) == object_id)
        .ok_or_else(|| anyhow!("Error in unwarp of object_id:{object_id}"))?;

    let frame_group = appearance
        .frame_group
        .iter()
        .find(|frame_group| {
            frame_group.fixed_frame_group.unwrap_or(-999) == FixedFrameGroup::ObjectInitial as i32
        })
        .or_else(|| appearance.frame_group.first())
        .ok_or_else(|| anyhow!("object id {object_id} has no frame_group"))?;

    let sprite_info = frame_group
        .sprite_info
        .as_ref()
        .ok_or_else(|| anyhow!("object id {object_id} frame_group has no sprite_info"))?;

    let pattern_width = sprite_info.pattern_width.unwrap_or(1).max(1);
    let pattern_height = sprite_info.pattern_height.unwrap_or(1).max(1);
    let pattern_depth = sprite_info.pattern_depth.unwrap_or(1).max(1);
    let layers = sprite_info.layers.unwrap_or(1).max(1);

    let phases = sprite_info
        .animation
        .as_ref()
        .map(|animation| animation.sprite_phase.len())
        .unwrap_or(0);

    let frames_count = if phases > 0 {
        phases as u32
    } else {
        sprite_info.pattern_frames.unwrap_or(1).max(1)
    };

    let sprites_per_frame = (layers * pattern_width * pattern_height * pattern_depth) as usize;

    let expected_len = (frames_count as usize) * sprites_per_frame;
    let got_len = sprite_info.sprite_id.len();

    if got_len < expected_len {
        return Err(anyhow!(
            "object {object_id}: sprite_id len to small. got={got_len} expected>={expected_len} \
        (layers={layers}, pattern={pattern_width}x{pattern_height}x{pattern_depth}, frames={frames_count})"
        ));
    }

    let mut frames = Vec::with_capacity(frames_count as usize);

    for frame in 0..frames_count as usize {
        let start = frame * sprites_per_frame;
        let end = start + sprites_per_frame;

        let sprite_ids = sprite_info.sprite_id[start..end].to_vec();

        let duration_ms = sprite_info
            .animation
            .as_ref()
            .and_then(|animation| animation.sprite_phase.get(frame))
            .map(|phase| {
                let min = phase.duration_min.unwrap_or(100);
                let max = phase.duration_max.unwrap_or(min);
                ((min + max) / 2).max(1)
            })
            .unwrap_or(100);

        frames.push(RenderFrame {
            duration_ms,
            sprite_ids,
        });
    }

    Ok(RenderPlan {
        kind: "object",
        id: object_id,
        pattern_width,
        pattern_depth,
        pattern_height,
        frames,
        layers,
    })
}
