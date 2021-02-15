import fastify from 'fastify';
import axios from 'axios'

const app = fastify({ logger: true });

const getCats = async () => {
  try {
    const {data} = await axios.get('https://cat-fact.herokuapp.com/facts/random?animal_type=cat&amount=3');
    return data.map(({text}) => text)
  } catch (err) {
    console.error(err);
    return null;
  }
}

const getFox = async () => {
  try {
    const { data: {image } }= await axios.get('https://randomfox.ca/floof/');
    return image;
  } catch (err) {
    console.error(err);
    return null;
  }
}

const getHolidays = async (country, year ) => {
  try {
    const {data} = await axios.get(`https://date.nager.at/api/v2/PublicHolidays/${year}/${country} `);
    return data;
  } catch (err) {
    console.error(err);
    return null;
  }
}

app.post('/', async (req, res) => {
  const [cats, fox, holidays] = await Promise.all([getCats(), getFox(), getHolidays(req.body?.countryCode ?? 'FR', req.body?.year ?? '2021')]);
  return {
    cats,
    fox,
    holidays
  };
});

// Run the server!
const start = async () => {
  try {
    await app.listen(5000);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};
start();
