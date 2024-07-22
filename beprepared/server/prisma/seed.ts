import { db } from "../src/database";
import  bcrypt from 'bcrypt';

const provinces = [
    {
        province: 'Cabo Delgado',
        districts: [
            'Ancuabe', 'Balama', 'Chiúre', 'Ibo', 'Macomia', 'Mecúfi', 'Meluco', 'Metuge',
            'Mocímboa da Praia', 'Montepuez', 'Mueda', 'Muidumbe', 'Namuno', 'Nangade', 'Palma',
            'Pemba', 'Quissanga'
        ]
    },
    {
        province: 'Gaza',
        districts: [
            'Bilene', 'Chibuto', 'Chicualacuala', 'Chigubo', 'Chókwè', 'Chongoene', 'Guijá',
            'Limpopo', 'Mabalane', 'Manjacaze', 'Mapai', 'Massangena', 'Massingir', 'Xai-Xai'
        ]
    },
    {
        province: 'Inhambane',
        districts: [
            'Funhalouro', 'Govuro', 'Homoíne', 'Inhambane', 'Inharrime', 'Inhassoro', 'Jangamo',
            'Mabote', 'Massinga', 'Maxixe', 'Morrumbene', 'Panda', 'Vilanculos', 'Zavala'
        ]
    },
    {
        province: 'Manica',
        districts: [
            'Bárue', 'Chimoio', 'Gondola', 'Guro', 'Macate', 'Machaze', 'Macossa', 'Manica',
            'Mossurize', 'Sussundenga', 'Tambara', 'Vanduzi'
        ]
    },
    {
        province: 'Maputo Provincia',
        districts: [
            'Boane', 'Magude', 'Manhiça', 'Marracuene', 'Matola', 'Matutuíne', 'Moamba', 'Namaacha'
        ]
    },
    {
        province: 'Maputo Cidade',
        districts: [
            'Maputo'
        ]
    },
    {
        province: 'Nampula',
        districts: [
            'Angoche', 'Eráti', 'Ilha de Moçambique', 'Lalaua', 'Larde', 'Liúpo', 'Malema', 'Meconta',
            'Mecubúri', 'Memba', 'Mogincual', 'Mogovolas', 'Moma', 'Monapo', 'Mossuril', 'Muecate',
            'Murrupula', 'Nacala-a-Velha', 'Nacala Porto', 'Nacarôa', 'Nampula', 'Rapale', 'Ribaué'
        ]
    },
    {
        province: 'Niassa',
        districts: [
            'Chimbonila', 'Cuamba', 'Lago', 'Lichinga', 'Majune', 'Mandimba', 'Marrupa', 'Maúa',
            'Mavago', 'Mecanhelas', 'Mecula', 'Metarica', 'Muembe', 'N\'gauma', 'Nipepe', 'Sanga'
        ]
    },
    {
        province: 'Sofala',
        districts: [
            'Beira', 'Búzi', 'Caia', 'Chemba', 'Cheringoma', 'Chibabava', 'Dondo', 'Gorongosa',
            'Machanga', 'Maringué', 'Marromeu', 'Muanza', 'Nhamatanda'
        ]
    },
    {
        province: 'Tete',
        districts: [
            'Angónia', 'Cahora-Bassa', 'Changara', 'Chifunde', 'Chiuta', 'Dôa', 'Macanga', 'Magoé',
            'Marara', 'Marávia', 'Moatize', 'Mutarara', 'Tete', 'Tsangano', 'Zumbo'
        ]
    },
    {
        province: 'Zambézia',
        districts: [
            'Alto Molócue', 'Chinde', 'Derre', 'Gilé', 'Gurué', 'Ile', 'Inhassunge', 'Luabo', 'Lugela',
            'Maganja da Costa', 'Milange', 'Mocuba', 'Mocubela', 'Molumbo', 'Mopeia', 'Morrumbala',
            'Mulevala', 'Namacurra', 'Namarroi', 'Nicoadala', 'Pebane', 'Quelimane'
        ]
    }
];

async function seed() {
    const passwordhash = await bcrypt.hash('12345678', 10);

    try {
        // Seed for provinces and districts
        for (const province of provinces) {
            const existingProvince = await db.province.findUnique({
                where: { designation: province.province }
            });

            if (!existingProvince) {
                await db.province.create({
                    data: {
                        designation: province.province,
                        districts: {
                            create: province.districts.map((district) => ({
                                designation: district
                            }))
                        }
                    }
                });
            } else {
                console.log(`Province ${province.province} already exists.`);
            }
        }

        // Seed for admin
        const existingAdmin = await db.admin.findUnique({
            where: { email: 'admin@beprepared.co.mz' }
        });

        if (!existingAdmin) {
            await db.admin.create({
                data: {
                    name: 'Administrator',
                    email: 'admin@beprepared.co.mz',
                    password: passwordhash
                }
            });
        } else {
            console.log('Admin already exists.');
        }

        console.log('seeds created!');
    } catch (error) {
        console.error('Error creating seeds:', error);
    }
}

seed();
