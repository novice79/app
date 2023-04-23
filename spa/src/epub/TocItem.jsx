import util from '../util'

export default function TocItem(props) {
  const { label, subitems } = props
  // console.log(props)

  const setLocation = () => {
    props.setLocation(props.href)
  } 
  return (
    <div>
      <button id={`${util.hash_code(props.href)}`} className='toc' onClick={setLocation}>
        {label}
      </button>
      {subitems && subitems.length > 0 && (
        <div style={{ paddingLeft: 10 }}>
          {subitems.map((item, i) => (
            <TocItem key={i} {...props} {...item} />
          ))}
        </div>
      )}
    </div>
  )
}