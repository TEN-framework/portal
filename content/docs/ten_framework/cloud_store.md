---
title: Cloud Store
---

The TEN Cloud Store, similar to Google Play on Android and the App Store on iOS, offers a variety of TEN packages. These packages can be downloaded into a TEN app to aid and enhance development.

![TEN Cloud Store](https://ten-framework-assets.s3.amazonaws.com/doc-assets/ten_cloud_store.png)

## Information Stored in the Database for TEN Packages

1. **Package Type**

   A string representing the type of package, such as `extension`.

2. **Package Name**

   A string representing the name of the package, such as `builtin_extension`.

3. **Package Version**

   A string following semantic versioning (semver) that specifies the package version, such as `3.0.0`.

4. **Dependencies**

   An array of objects, each containing the following fields:

   - **Package Type**

     A string, matching the top-level `package type`.

   - **Package Name**

     A string, matching the top-level `package name`.

   - **Version**

     A string following semver that specifies the version requirements for the package, such as `~3.0.0`.
