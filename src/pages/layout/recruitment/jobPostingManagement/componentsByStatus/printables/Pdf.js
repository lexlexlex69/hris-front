import Item4 from '../../../plantilla/plantillaPdf/Item4';
import Items1_3 from '../../../plantilla/plantillaPdf/Items1_3';
import Items5_16 from '../../../plantilla/plantillaPdf/Items5_16';
import Items17_19 from '../../../plantilla/plantillaPdf/Items17_19';
import Items20_23 from '../../../plantilla/plantillaPdf/Items20_23';

const Pdf = ({ data }) => {

    return (
        <div style={{ padding: '0px 20px', paddingTop: '20px' }}>
            <table className='plantillaPdfTable' style={{ width: '100%', marginLeft: '25px', marginRight: '25px', margin: 'auto' }} >
                <tbody>
                    <Items1_3 data={data} />
                    <Item4 data={data} />
                    <Items5_16 data={data} />
                    <Items17_19 data={data} />
                </tbody>
            </table>
            <div className='force-break' style={{ marginTop: '20px' }}>
                <Items20_23 data={data} />
            </div>
        </div>
    );
};

export default Pdf;