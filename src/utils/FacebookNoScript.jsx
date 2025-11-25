function FacebookNoScript({ pixelId }) {
  if (!pixelId) return null;

  return (
    <noscript>
      <img
        height="1"
        width="1"
        style={{ display: 'none' }}
        src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
        alt="fb-pixel-noscript"
      />
    </noscript>
  );
}
export default FacebookNoScript;