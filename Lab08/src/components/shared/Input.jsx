function Input({ label, type, value, name, onChange, placeholder }) {
  return (
    <>
      {label && <label>{label}</label>}
      <input
        type={type}
        value={value}
        name={name}
        onChange={onChange}
        onDoubleClick={(e) => {
          e.target.value = "";
          onChange(e);
        }}
        placeholder={placeholder}
      />
    </>
  );
}
export default Input;
