fn main() {
    println!("cargo:rerun-if-changed=proto/appearances.proto");

    let protoc =
        protoc_bin_vendored::protoc_bin_path().expect("failed to get vendored protoc path");

    unsafe {
        std::env::set_var("PROTOC", protoc);
    }

    prost_build::compile_protos(&["proto/appearances.proto"], &["proto"])
        .expect("prost-build failed");
}
