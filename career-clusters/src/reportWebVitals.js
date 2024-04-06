/*
Function for reporting web vitals metrics.
- It accepts a callback function 'onPerfEntry' as a parameter.
- If 'onPerfEntry' is provided and is a function:
  - It asynchronously imports 'web-vitals' library.
  - Once imported, it retrieves various web vitals metrics using the library's functions:
    - getCLS: Cumulative Layout Shift
    - getFID: First Input Delay
    - getFCP: First Contentful Paint
    - getLCP: Largest Contentful Paint
    - getTTFB: Time to First Byte
  - It then calls each of these functions with the 'onPerfEntry' callback.

  LAST EDITED 04/05/2024 Gavin T. Anderson
*/

const reportWebVitals = onPerfEntry => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  }
};

export default reportWebVitals;
