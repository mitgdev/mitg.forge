use anyhow::Result;

fn main() -> Result<()> {
    let path = std::env::args()
        .nth(1)
        .expect("usage: appearances_inspect <path>");

    let app = assets::appearances::load_appearances_dat(&path)?;
    let s = assets::appearances::stats(&app);

    println!("objects={} last_id={}", s.objects, s.object_last_id);
    println!("outfits={} last_id={}", s.outfits, s.outfit_last_id);
    println!("effects={} last_id={}", s.effects, s.effect_last_id);
    println!("missiles={} last_id={}", s.missiles, s.missile_last_id);

    Ok(())
}
