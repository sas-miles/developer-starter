import BaseScene from '../BaseScene';
const SubScene = () => {
  return (
    <BaseScene>
      <mesh position={[0, 0, 0]}>
        <torusGeometry args={[1, 0.5, 16, 60]} />
        <meshStandardMaterial color={'#ffffff'} />
      </mesh>
    </BaseScene>
  );
};

export default SubScene;
