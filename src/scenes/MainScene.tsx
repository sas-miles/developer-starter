import BaseScene from '../BaseScene';

const MainScene = () => {
  return (
    <BaseScene>
      <mesh position={[0, 0, 0]}>
        <boxGeometry />
        <meshStandardMaterial color={'#ffffff'} />
      </mesh>
    </BaseScene>
  );
};

export default MainScene;
