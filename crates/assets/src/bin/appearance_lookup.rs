use anyhow::{Result, anyhow};
use assets::appearances::{AppearanceKind, find_by_id, load_appearances_dat};

fn parse_kind(s: &str) -> Result<AppearanceKind> {
    Ok(match s {
        "object" => AppearanceKind::Object,
        "outfit" => AppearanceKind::Outfit,
        "effect" => AppearanceKind::Effect,
        "missile" => AppearanceKind::Missile,
        _ => {
            return Err(anyhow!(
                "kind inválido: {s} (use object|outfit|effect|missile)"
            ));
        }
    })
}

fn main() -> Result<()> {
    let mut args = std::env::args().skip(1);

    let path = args
        .next()
        .expect("usage: appearance_lookup <appearances.dat> --kind object --id 100");
    let mut kind: Option<AppearanceKind> = None;
    let mut id: Option<u32> = None;

    while let Some(a) = args.next() {
        match a.as_str() {
            "--kind" => kind = Some(parse_kind(&args.next().expect("--kind precisa de valor"))?),
            "--id" => id = Some(args.next().expect("--id precisa de valor").parse()?),
            _ => {}
        }
    }

    let kind = kind.ok_or_else(|| anyhow!("faltou --kind"))?;
    let id = id.ok_or_else(|| anyhow!("faltou --id"))?;

    let app = load_appearances_dat(&path)?;
    let a = find_by_id(&app, kind, id).ok_or_else(|| anyhow!("appearance não encontrado"))?;

    println!("id={}", a.id.unwrap_or(0));
    println!("frame_groups={}", a.frame_group.len());

    for (i, fg) in a.frame_group.iter().enumerate() {
        let ff = fg.fixed_frame_group.unwrap_or(-1);
        let gid = fg.id.unwrap_or(0);

        println!("\n== frame_group[{i}] fixed={ff} id={gid} ==");

        if let Some(si) = fg.sprite_info.as_ref() {
            let pw = si.pattern_width.unwrap_or(1);
            let ph = si.pattern_height.unwrap_or(1);
            let pd = si.pattern_depth.unwrap_or(1);
            let layers = si.layers.unwrap_or(1);
            let frames = si.pattern_frames.unwrap_or(1);

            for sprite_id in si.sprite_id.iter() {
                println!("sprite_id={sprite_id}");
            }

            println!("pattern: w={pw} h={ph} d={pd} layers={layers} frames={frames}");
            println!("sprite_ids_len={}", si.sprite_id.len());

            if frames > 0 {
                let per_frame = (si.sprite_id.len() as u32) / frames;
                println!("sprites_per_frame≈{per_frame}");
            }

            if let Some(anim) = si.animation.as_ref() {
                println!("has_animation=true phases={}", anim.sprite_phase.len());
                for (p, ph) in anim.sprite_phase.iter().take(10).enumerate() {
                    println!(
                        " phase[{p}] min={} max={}",
                        ph.duration_min.unwrap_or(0),
                        ph.duration_max.unwrap_or(0)
                    );
                }
                if anim.sprite_phase.len() > 10 {
                    println!(" ... (mais fases)");
                }
            } else {
                println!("has_animation=false");
            }
        } else {
            println!("sprite_info: none");
        }
    }

    Ok(())
}
