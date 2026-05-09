

export default function WaveBackground() {
  return (
    <div className="wave-bg">
      <img
        src="/WAVE.png"
        alt="Wave Background"
        style={{
          width: '100%',
          height: '110%',
          position: 'absolute',
          bottom: 0,
          left: 0,
          opacity: 0.8,
          pointerEvents: 'none'
        }}
      />
    </div>
  );
}