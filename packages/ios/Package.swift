// swift-tools-version:5.9
import PackageDescription

let package = Package(
    name: "RQBBOXOSLauncher",
    platforms: [
        .iOS(.v15)
    ],
    products: [
        .library(name: "RQBBOXOSLauncher", targets: ["RQBBOXOSLauncher"])
    ],
    dependencies: [],
    targets: [
        .target(
            name: "RQBBOXOSLauncher",
            dependencies: [],
            path: "Sources/RQBBOXOSLauncher"
        ),
        .testTarget(
            name: "RQBBOXOSLauncherTests",
            dependencies: ["RQBBOXOSLauncher"],
            path: "Tests/RQBBOXOSLauncherTests"
        )
    ]
)
