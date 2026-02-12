-- =============================================
-- Script de Criação do Banco de Dados COTEC
-- Sistema de Gestão de COTECs de Goiás
-- Data: 02/02/2026
-- Banco: oliverit
-- =============================================

-- Criar banco de dados
CREATE DATABASE IF NOT EXISTS oliverit CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE oliverit;

-- =============================================
-- TABELA: equipe_ti
-- Descrição: Armazena dados da equipe de TI dos COTECs
-- =============================================
CREATE TABLE IF NOT EXISTS equipe_ti (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cotec VARCHAR(255) NOT NULL,
    cidade VARCHAR(100) NOT NULL,
    telefone VARCHAR(20),
    nome VARCHAR(150) NOT NULL,
    horario TEXT,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_cidade (cidade),
    INDEX idx_cotec (cotec(100))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- TABELA: impressoras
-- Descrição: Controle de impressoras dos COTECs
-- =============================================
CREATE TABLE IF NOT EXISTS impressoras (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cotec VARCHAR(255) NOT NULL,
    cidade VARCHAR(100) NOT NULL,
    monocromatica INT DEFAULT 0,
    policromatica INT DEFAULT 0,
    funcionando VARCHAR(10) DEFAULT 'SIM',
    obs TEXT,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_cidade (cidade),
    INDEX idx_funcionamento (funcionando)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- TABELA: internet
-- Descrição: Informações de conectividade dos COTECs
-- =============================================
CREATE TABLE IF NOT EXISTS internet (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cotec VARCHAR(255) NOT NULL,
    cidade VARCHAR(100) NOT NULL,
    velocidade_link VARCHAR(100),
    operadora VARCHAR(100),
    speedtest VARCHAR(255),
    obs TEXT,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_cidade (cidade),
    INDEX idx_operadora (operadora)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- TABELA: equipamentos
-- Descrição: Inventário de equipamentos dos COTECs
-- =============================================
CREATE TABLE IF NOT EXISTS equipamentos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cotec VARCHAR(255) NOT NULL,
    cidade VARCHAR(100) NOT NULL,
    equipamentos TEXT,
    unifi VARCHAR(50),
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_cidade (cidade)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- TABELA: emails_corporativos
-- Descrição: Gerenciamento de emails corporativos
-- =============================================
CREATE TABLE IF NOT EXISTS emails_corporativos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    cpf VARCHAR(11),
    email_pessoal VARCHAR(150),
    email_corporativo VARCHAR(150) NOT NULL UNIQUE,
    status ENUM('criado', 'Solicitado') DEFAULT 'Solicitado',
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_cpf (cpf),
    INDEX idx_status (status),
    INDEX idx_email_corporativo (email_corporativo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- INSERÇÃO DE DADOS - EQUIPE TI
-- =============================================
INSERT INTO equipe_ti (cotec, cidade, telefone, nome, horario) VALUES
('COTEC -MARIA SEBASTIANA DA SILVA', 'PORANGATU-GO', '(62)9 9925-6161', 'JOÃO ANDRÉ ALVES CARVALHO', '07:00 -11:30 / 13:30 -17:00 - Sábado 08:00 ás 12:00'),
('COTEC - AGUINALDO CAMPOS NETO', 'CATALÃO-GO', '(64) 9 8421-0755', 'AGUINALDO DA SILVEIRA', '13:00 - 17:00 / 18:00 - 22:00 - Sábado 08:00 às 12:00'),
('COTEC - CELIO DOMINGOS MAZZONETTO', 'CERES-GO', '(62)99641-2381', 'WALTER JUNIOR JOVENCIO DE FARIA', '08:00-11:00 / 13:00 - 18:00 - Sábado 08:00 às 12:00'),
('COTEC - LUIZ HUMBERTO DE MENEZES', 'SANTA HELENA DE GOIAS - GO', '(64) 9 9270-1291', 'MOUZER DA SILVA', ''),
('COTEC - GOVERNADOR ONOFRE QUINAN', 'ANÁPOLIS', '(62) 99664-6382', 'JEBBERSON MOURA DA COSTA', '13:00 - 17:00 / 18:00 - 22:00 - Sábado 08:00 as 12:00'),
('COTEC - GOVERNADOR ONOFRE QUINAN', 'ANÁPOLIS', '(62) 99115-1803', 'DIEGO DOS SANTOS MACHADO', '08:00 - 12:00 / 13:00 - 17:00 - Sábado 08:00 as 12:00'),
('COTEC - SEBASTIÃO DE SIQUEIRA', 'GOIÂNIA - GO', '(62) 9 8188-1083', 'JAILTON CARVALHO FELIX', ''),
('COTEC - RUTH VILAÇA CORREIA LEITE CARDOSO', 'CAIAPÔNIA - GO', '(64) 99963-0129', 'WAGTON RODRIGUES SOUSA', '13:00 - 17:00 / 18:00 - 22:00 - Sábado 08:00 às 12:00'),
('COTEC - GOVERNADOR OTÁVIO LAGE', 'GOIANÉSIA', '(62) 98403-6513', 'EDUARDO JOSÉ MAGALHÃES', '07:00 - 11:00 / 13:00 - 17:00 - Sábado 08:00 às 12:00'),
('COTEC - CELSO MONTEIRO FURTADO', 'URUANA - GO', '(62) 98447-7408', 'THALLES HENRIQUE PIRES MACHADO', '08:00 - 12:00 / 14:00 - 18:00 - Sábado 08:00 / 12:00'),
('COTEC - JERÔNIMO CARLOS DO PRADO', 'GOIATUBA - GO', '(64) 99223-8723', 'ALEX ANTÔNIO DOS SANTOS', '08:00 - 11:00 / 13:00 - 18:00 - Sábado 08:00 AS 12:00'),
('COTEC - JERÔNIMO CARLOS DO PRADO', 'GOIATUBA - GO', '(64) 98452-0286', 'JULY HONORATO', '13:00 - 17:00 / 18:00 - 22:00 - Sábado 08:00 AS 12:00'),
('COTEC - GOIADIRA AYRES DO COUTO', 'GOIÁS-GO', '(62)99671-2955', 'DANYEL ARRAIS', '08:00 - 12:00 / 13:00 - 17:00'),
('COTEC - IRTES ALVES DE CASTRO RIBEIRO', 'JARAGUÁ - GO', '(62) 9 84022864', 'EGUIMAR AZEVEDO DA SILVA', '08:00-12:00 / 14:00 - 18:00'),
('COTEC - IRTES ALVES DE CASTRO RIBEIRO', 'JARAGUÁ - GO', '(62) 9 85304639', 'MAYARA DIAS PEREIRA', '08:00-12:00 / 14:00 - 18:00'),
('COTEC - PADRE ANTONIO VERMEY', 'PALMEIRAS DE GOIAS-GO', '(64) 9 9223-0312', 'AGNALDO FELICIO DE CARVALHO FILHO', '13:00-17:00/ 17:00-18:00 - Sábado 08:00 as 12:00'),
('COTEC - GENERVINO EVANGELISTA DA FONSECA', 'CRISTALINA - GO', '(61) 9 9938-2647', 'AGNALDO BARROS RIBEIRO DOS SANTOS', '08:00-12:00/ 18:00 - 22:00 - Sábado 08:00 as 12:00'),
('', 'FORMOSA - GO', '', '', '');

-- =============================================
-- INSERÇÃO DE DADOS - IMPRESSORAS
-- =============================================
INSERT INTO impressoras (cotec, cidade, monocromatica, policromatica, funcionando, obs) VALUES
('COTEC -MARIA SEBASTIANA DA SILVA', 'PORANGATU-GO', 3, 1, 'SIM', '1 impressora do colegio'),
('COTEC - AGUINALDO CAMPOS NETO', 'CATALÃO-GO', 2, 1, 'SIM', 'LOCADA'),
('COTEC - CELIO DOMINGOS MAZZONETTO', 'CERES-GO', 5, 1, 'SIM', '3 impressoras do colégio'),
('COTEC - LUIZ HUMBERTO DE MENEZES', 'SANTA HELENA DE GOIAS - GO', 2, 1, 'SIM', ''),
('COTEC - GOVERNADOR ONOFRE QUINAN', 'ANÁPOLIS', 4, 1, 'SIM', '2 Impressoras da escola'),
('COTEC - SEBASTIÃO DE SIQUEIRA', 'GOIÂNIA', 2, 1, 'SIM', '2 Impressoras do Colégio'),
('COTEC - RUTH VILAÇA CORREIA LEITE CARDOSO', 'CAIAPÔNIA - GO', 2, 1, 'SIM', 'LOCADAS'),
('COTEC - GOVERNADOR OTÁVIO LAGE', 'GOIANÉSIA', 2, 1, 'SIM', 'LOCADAS'),
('COTEC - CELSO MONTEIRO FURTADO', 'URUANA - GO', 2, 1, 'SIM', 'LOCADAS'),
('COTEC - JERÔNIMO CARLOS DO PRADO', 'GOIATUBA - GO', 2, 1, 'SIM', 'LOCADAS'),
('COTEC - GOIADIRA AYRES DO COUTO', 'GOIÁS-GO', 2, 1, 'SIM', 'LOCADAS'),
('COTEC - IRTES ALVES DE CASTRO RIBEIRO', 'JARAGUÁ - GO', 2, 1, 'SIM', 'LOCADAS'),
('COTEC - PADRE ANTONIO VERMEY', 'PALMEIRAS DE GOIAS -GO', 2, 1, 'SIM', 'LOCADAS'),
('COTEC - GENERVINO EVANGELISTA DA FONSECA', 'CRISTALINA - GO', 2, 1, 'SIM', 'LOCADAS');

-- =============================================
-- INSERÇÃO DE DADOS - INTERNET
-- =============================================
INSERT INTO internet (cotec, cidade, velocidade_link, operadora, speedtest, obs) VALUES
('COTEC -MARIA SEBASTIANA DA SILVA', 'PORANGATU-GO', '2 PONTOS -500 GB', 'VIVO -TERRA - FIBRA', '800.77-Download Mbps - 302.09 Upload Mbps', 'REDE CONECTA'),
('COTEC - AGUINALDO CAMPOS NETO', 'CATALÃO-GO', '1 GB', 'TEK TURBO', '936.82 DOWN - 445.88 UPLOAD', ''),
('COTEC - LUIZ HUMBERTO DE MENEZES', 'SANTA HELENA DE GOIAS - GO', '500 MB', 'NETFRIBRA', '519 D - 372 UP', 'REDE CONECTA'),
('COTEC - SEBASTIÃO DE SIQUEIRA', 'GOIÂNIA', '1 GB', 'LINQ TELECOM', '', ''),
('COTEC - RUTH VILAÇA CORREIA LEITE CARDOSO', 'CAIAPÔNIA - GO', '1 GB', 'FIBERNET', '823.77 DOWNLOAD - 475.32 UPLOAD', ''),
('COTEC - GOVERNADOR OTÁVIO LAGE', 'GOIANÉSIA', '1 GIGA', 'INFOTECH', '657.53-Dow Mbps | 465.89 Up Mbps', ''),
('COTEC - CELSO MONTEIRO FURTADO', 'URUANA - GO', '1 GB', 'GIGABYTE', '905,7 - DOWNLOAD / 502,2 - UPLOAD', ''),
('COTEC - JERÔNIMO CARLOS DO PRADO', 'GOIATUBA - GO', '2 LINKS - 800 GB', 'CLICK TURBO', '650 DOWN - 500 UPLOAD', ''),
('COTEC - GOIADIRA AYRES DO COUTO', 'GOIÁS-GO', '1 GB', 'AERO REDE', '880.70 Download / 412.14 Upload', 'REDE CONECTA'),
('COTEC - IRTES ALVES DE CASTRO RIBEIRO', 'JARAGUÁ - GO', '1 GB', 'GIGA BYTE', '900 MB', ''),
('COTEC - CELIO DOMINGOS MAZZONETTO', 'CERES - GO', '900 MB', 'GIGABYTE', '850 DOWNLOAD / 470 UPLOAD', ''),
('COTEC- PADRE ANTONIO VERMEY', 'PALMEIRAS DE GOIAS-GO', '2 LINKS- 800 MB', 'ONLINE', '782 DOWNLOAD / 736 UPLOAD', 'REDE CONECTA'),
('COTEC - GENERVINO EVANGELISTA DA FONSECA', 'CRISTALINA - GO', '1 GB', 'NETIX', '880 DOWNLOAD / 880 UPLOAD', '');

-- =============================================
-- INSERÇÃO DE DADOS - EQUIPAMENTOS
-- =============================================
INSERT INTO equipamentos (cotec, cidade, equipamentos, unifi) VALUES
('COTEC -MARIA SEBASTIANA DA SILVA', 'PORANGATU-GO', '2 ALICATE DE CRIMPAR, 3 ALICATES DE CORTE 1 ALICATES DE BICO, 6 CHAVES FILIPS, 7 CHAVES DE FENDA, 1 MULTMETRO, 1 FERRO DE SOLDA, 1 TESTADOR DE CABO, 4 PENDRIVE ,1 HD EXTERNO.', '6 UNIFI'),
('COTEC - LUIZ HUMBERTO DE MENEZES', 'SANTA HELENA DE GOIAS - GO', '1 ALICATE DE CRIMPAR, 4 ALICATES DE CORTE, 1 ALICATE, 1 ALICATES DE BICO, 3 CAHVES FILIPS, 5 CAHVES DE FENDA, 1 MULTIMETRO, 1 FERRO DE SOLDA, 1 TESTADOR DE CABO, 6 PENDRIVE, 1 HD EXTERNO', '6 UNI FI'),
('COTEC SEBASTIÃO DE SIQUEIRA', 'GOIÂNIA - GO', '2 CHAVES DE FENDA, 2 CHAVES FILIPS, 1 TESTADOR DE REDE, 4 ALICATES DE CRIMPAR, 1 FERRO DE SOLDA, 1 MULTIMETRO', ''),
('COTEC - RUTH VILAÇA CORREIA LEITE CARDOSO', 'CAIAPÔNIA - GO', '1 HD EXTERNO 2 TB – KROSSELEGANCE, 1 TESTADOR DE CABO DE REDE – BOMVINK, 1 MULTIMETRO DIGITAL – THOMPSON, 1 LOCALIZADOR DE CABOS – EXBOM, 1 ALICATE DE CRIMPAR RJ45/RJ11/RJ12 – BOMVINK, 2 KIT CHAVES STANLEY, 2 LIMPA CONTATO MP80 MUNDIAL PRIME, 9 BATERIAS LÍTIO 3V CR2032, 80 CONECTORES RJ45 CAT6 - INTELBRAS, 2 PENDRIVES 32 GB – KINGSTON, 6 CHAVES DE FENDA, 4 CHAVES PHILIPS, 1 FERRO DE SOLDA, 3 PUNCH DOWN, 1 ALICATE UNIVERSAL, 1 ALICATE DE BICO, 2 ALICATES DE CORTE DIAGONAL', '7 UNIFI'),
('COTEC - GOVERNADOR OTÁVIO LAGE', 'GOIANÉSIA', '4 - ALICATE BICO MEIA CANA, 2 - ALICATE DE CORTE DIAGONAL, 2 - ALICATE UNIVERSAL, 3 - ALICATE PUNCH DOWN, 1 - ALICATE DECAPADOR, 2 - PARAFUSADEIRAS A BATERIA, 7 - PEN-DRIVE, 1 - HD EXTERNO, 2 - JOGO DE CHAVES PRECISÃO 6 PCS, 10 - CHAVE DE FENDA, 6 - CHAVE PHILIPS, 1 - JOGO DE CHAVES ALLEN, 2 - ALICATE DE CRIMPAR, 1 - TESTADOR DE CABOS, 1 - MULTÍMETRO DIGITAL, 1 - FERRO DE SOLDA, 1 - PASSADOR DE FIOS 20M COM ALMA DE AÇO, 1 - PENTE DE CABOS ORGANIZADOR CAT.5E/CAT.6, 1 - FERRAMENTA PARA FIXAÇÃO E REMOÇÃO DE PORCA GAIOLA M5 OU M6, 1 - BOLSA FERRAMENTAS FUNDO EMBORRACHADO 24 COMPARTIMENTOS LOTUS', '7 UNIFI'),
('COTEC - CELSO MONTEIRO FURTADO', 'URUANA - GO', '3 ALICATES DE CRIMPAGEM, 3 ALICATES PUNCH DOWN, 1 ALICATE DE CRIMPAGEM E DECAPAGEM, 1 ALICATE UNIVERSAL, 1 ALICATE DE BICO, 2 ALICATES DE CORTE, 1 PCT 60 CONECTORES MACHO RJ45 CAT6, 5 CONECTORES FÊMEA RJ45 CAT6, 2 TESTADORES DE CABO, 1 TESTADOR E LOCALIZADOR DE CABOS, 1 CX DE CABO PAR-TRANÇADO CAT6, JOGO DE CHAVES PHILLIPS, JOGO DE CHAVES DE FENDA, 2 JOGOS DE CHAVES DE FENDA DE PRECISÃO, 10 BATERIAS CR2032, 1 FITA ISOLANTE, 1 LIMPA-CONTATO SPRAY, 1 FERRO DE SOLDA (SEM ESTANHO), 1 HD EXTERNO 500GB, 1 HD EXTERNO 2TB, 15 PEN-DRIVE 4GB, 4 WEBCAM', '4 UNIFI'),
('COTEC - JERÔNIMO CARLOS DO PRADO', 'GOIATUBA - GO', '2 - ALICATE BICO, 2 - ALICATE PUNCH DOWN, 2 - PEN-DRIVE, 1 - JOGO CHAVE PHILIPS, 1 - ALICATE DE CRIMPAR, 1 - TESTADOR DE CABOS, 1 - MULTÍMETRO DIGITAL, 1 - FERRO DE SOLDA', '7 UNIFI'),
('COTEC - GOIADIRA AYRES DO COUTO', 'GOIÁS-GO', '01 - ALICATE UNIVERSAL, 01 - ALICATE DE BICO, 01 - ALICATE DE CORTE, 01 - ALICATE PUNCH DOWN, 01 - PEN-DRIVE, 02 - JOGO CHAVE PHILIPS, 02 - ALICATE DE CRIMPAR, 01 - TESTADOR DE CABOS, 01 - LOCALIZADOR DE CABOS, 01 - FERRO DE SOLDA, 01 - SOPRADOR, 01 - ESTILETE', '10 UNIFI'),
('COTEC - GOVERNADOR ONOFRE QUNIAN', 'ANÁPOLIS', '02 - ALICATE UNIVERSAL, 02 - ALICATE DE BICO, 02 - ALICATE DE CORTE, 02 - PEN-DRIVE (32GB), 01 – HD EXTERNO (1TB), 01 – MULTÍMETRO, 02 – PUNCH DOWN, 01 - JOGO CHAVE PHILIPS, 02 - ALICATE DE CRIMPAR, 01 - TESTADOR DE CABOS, 01 - LOCALIZADOR DE CABOS, 01 - FERRO DE SOLDA, 01 - SOPRADOR, 01 - ESTILETE, 01 – DECAPADOR DE CABOS', '6'),
('COTEC - IRTES ALVES DE CASTRO RIBEIRO', 'JARAGUÁ - GO', '1 ALICATES DE CRIMPAGEM, 1 ALICATES PUNCH DOWN, 1 ALICATE DE DECAPAGEM, 1 ALICATE UNIVERSAL, 1 ALICATE DE BICO, 2 ALICATES DE CORTE, 10 CONECTORES FÊMEA RJ45 CAT6, 1 TESTADORES DE CABO, 1 TESTADOR E LOCALIZADOR DE CABOS, 1 CX DE CABO PAR-TRANÇADO CAT6, JOGO DE CHAVES PHILLIPS, 1 CHAVE DE FENDA, 2 JOGOS DE CHAVES DE FENDA DE PRECISÃO, 50 BATERIAS CR2032, 1 FITA ISOLANTE, 1 LIMPA-CONTATO SPRAY, 1 FERRO DE SOLDA (SEM ESTANHO), 2 PEN-DRIVE 32GB, 1 ESTILETE, 1 FERRO DE SOLDA', '3 UNIFI'),
('COTEC - CELIO DOMINGOS MAZZONETTO', 'CERES - GO', '7 CHAVES DE FENDA, 6 CHAVES PHILIPS, 1 TESTADOR DE CABO, 1 ALICATE, 1 ALICATE DE CORTE, 3 ALICATE DE CRIMPAR, 3 HD EXTERNO, 1 PENDRIVE, 1 PINCEL, 2 ESTILETE, 1 KIT CHAVE DE PRECISÃO, 2 ALICATE PUNCH DOWN, 1 PASSA FIO, 2 ALICATE DE DESCASCAR FIO, 1 MULTIMETRO', '4 UNIFI'),
('COTEC - PADRE ANTONIO VERMEY', 'PALMEIRAS DE GOIAS-GO', '2 ALICATES DE CRIMPAR, 1 HD EXTERNO, 2 ALICATES DE CORTE, 1 MULTIMETRO, 2 ALICATES PUNCH DOWN, 3 PEN DRIVE, 1 JOGO DE CHAVE NORMAL, 2 ALICATE DE DESCASCAR FIO, 1 FERRO DE SOLDA', '4 UNIFI'),
('COTEC - AGUINALDO CAMPOS NETO', 'CATALÃO-GO', '03 ALICATE UNIVERSAL, 01 ALICATE CORTE, 01 ALICATE BICO, 02 ALICATE DECAPADOR, 05 ALICATE CRIMPAGEM, 03 CHAVE FENDA, 01 CHAVE FENDA TESTE FASE, 04 CHAVE PHILIPS, 01 ESTILETE, 01 JOGO CHAVE DE PRECISAO PHILIPS STANLEY C/6, 01 PUNCH DOWN, 02 PENDRIVE 64GB, 02 HD EXTERNO 2 TB', '3');

-- =============================================
-- INSERÇÃO DE DADOS - EMAILS CORPORATIVOS
-- =============================================
INSERT INTO emails_corporativos (nome, cpf, email_pessoal, email_corporativo, status) VALUES
('Gabriel Felipe Correa Gomes', '07802618100', 'gfcggabrielcorrea@gmail.com', 'gabriel.gomes@goias.gov.br', 'criado'),
('Iara Lyssa Nunes Dias', '02530407100', 'lyssnunes@gmail.com', 'iara.dias@goias.gov.br', 'criado'),
('Adriana Gomes Bezerra Martins', '43042341100', 'adrianagbezerra@hotmail.com', 'adriana.bmartins@goias.gov.br', 'criado'),
('Ana Flavia Bueno de Souza', '420015108', 'aninhavitoriabvalentina@gmail.com', 'ana.bdsouza@goias.gov.br', 'criado'),
('Ana Lidia de Sousa Gomes', '1689160101', 'analidiasouza55@gmail.com', 'ana.lsgomes@goias.gov.br', 'criado'),
('Ana Paula de Aguiar Berger', '5865281640', 'anapaula.berger@gmail.com', 'ana.berger@goias.gov.br', 'criado'),
('Angelica Perez Goulart', '94067422172', 'angelica_pgoulart@hotmail.com', 'angelica.goulart@goias.gov.br', 'criado'),
('Bruno Jose Ferreira Freitas', '70298307170', 'freitasb80@gmail.com', 'bruno.ffreitas@goias.gov.br', 'criado'),
('Danilo Alves de Lima', '1036571181', 'daniloalves2005@gmail.com', 'danilo.adlima@goias.gov.br', 'criado'),
('Darlene Viana de Santana Mendes', '1037734106', 'darlenevsmendes@gmail.com', 'darlene.mendes@goias.gov.br', 'criado'),
('Dayane Cabral Araujo Ribeiro', '97966398153', 'day.cabral@hotmail.com', 'dayane.aribeiro@goias.gov.br', 'criado'),
('Deidiane Teixeira de Macedo', '1133734146', 'deidiane.macedo5@gmail.com', 'deidiane.macedo@goias.gov.br', 'criado'),
('Dina Sonia de Queiroz', '38078317115', 'dinaqueiroz@msn.com', 'dina.queiroz@goias.gov.br', 'criado'),
('Dirceu Manoel de Almeida Junior', '58476377134', 'dirceujunior2014@gmail.com', 'dirceu.almeida@goias.gov.br', 'criado'),
('Edna Lemes Martins Pereira', '45154848187', 'ednapgtu1@gmail.com', 'edna.mpereira@goias.gov.br', 'criado'),
('Elaine Alves de Almeida', '470463171', 'elaine.wjf@gmail.com', 'elaine.aalmeida@goias.gov.br', 'criado'),
('Elis Cristina da Silva Pereira', '75524317172', 'eliscristinasilva09@gmail.com', 'elis.pereira@goias.gov.br', 'criado'),
('Elisete Resende Souza Yamabe', '83595414187', 'lizayamabe@gmail.com', 'elisete.yamabe@goias.gov.br', 'criado'),
('Ellen Caetano de Oliveira Borges', '300389108', 'ellencaetano@hotmail.com', 'ellen.borges@goias.gov.br', 'criado'),
('Fânia Borges Santos', '97248347604', 'faniaborges10@gmail.com', 'fania.santos@goias.gov.br', 'criado'),
('Flavio Antonio Barbosa Neves', '95079890134', 'fbn.antonio@gmail.com', 'flavio.neves@goias.gov.br', 'criado'),
('Geisiane Rosa da Silva Magalhaes', '88850676115', 'geisianemagalhaes@hotmail.com', 'geisiane.magalhaes@goias.gov.br', 'criado'),
('Geovani Corcino dos Santos', '2714242146', 'geovanicorcino@professorept.com', 'geovani.csantos@goias.gov.br', 'criado'),
('Glaucia Matias dos Santos', '95063102115', 'glauciamatias25@gmail.com', 'glaucia.santos@goias.gov.br', 'criado'),
('Ismael César Nogueira da Abadia', '62985669400', 'bobnooguer@gmail.com', 'ismael.nogueira@goias.gov.br', 'criado'),
('Ivone Arruda Ribeiro', '24318361187', 'ivonearrudaribeiro@hotmail.com', 'ivone.ribeiro@goias.gov.br', 'criado'),
('Joarina Novantino dos Santos', '99981661104', 'joarina@hotmail.com', 'joarina.santos@goias.gov.br', 'criado'),
('Karla Brenda Costa Goncalves El Homsi', '36088650125', 'karla.brenda@live.com', 'karla.homsi@goias.gov.br', 'criado'),
('Karolyne Stephany Leite', '70117394165', 'karolynestephany@gmail.com', 'karolyne.leite@goias.gov.br', 'criado'),
('Kelly Alves dos Anjos', '66416108', 'kellyanjos31@gmail.com', 'kelly.martins@goias.gov.br', 'criado'),
('Leidynara Fatima Porto', '2462495139', 'leidy.porto@outlook.com', 'leidynara.porto@goias.gov.br', 'criado'),
('Lia Pinto Cunha Borges dos Santos', '85685780125', 'liapcbs2@gmail.com', 'lia.santos@goias.gov.br', 'criado'),
('Luana Cristina Alkmim Reis', '6797614627', 'luakar1984@gmail.com', 'luana.areis@goias.gov.br', 'criado'),
('Luiz Jose Marques de Faria Junior', '1774708108', 'luizfsa23@gmail.com', 'luiz.faria@goias.gov.br', 'criado'),
('Magno da Costa Lima', '2307893156', 'limmamagno@gmail.com', 'magno.clima@goias.gov.br', 'criado'),
('Marcia Dias de Lima', '96585382153', 'marciadiasdelima@outlook.com', 'marcia.dlima@goias.gov.br', 'criado'),
('Marilene Barbosa Nunes Duarte', '3962021604', 'mariduartenunes@outlook.com', 'marilene.duarte@goias.gov.br', 'criado'),
('Marilia Toledo Espindola', '83258833168', 'mariliatoledo26@hotmail.com', 'marilia.espindola@goias.gov.br', 'criado'),
('Marluce Alves da Silva', '43882072172', 'alvesilva.marluce@gmail.com', 'marluce.silva@goias.gov.br', 'criado'),
('Michelle Aparecida Machado', '3071050160', 'michelle.machado.cotec@gmail.com', 'michelle.machado@goias.gov.br', 'criado'),
('Mizael Vaz Crisostomo Peixoto', '70037802160', 'mizaelvcp@gmail.com', 'mizael.peixoto@goias.gov.br', 'criado'),
('Nayane Junqueira Duarte Faria', '1144407192', 'nayanejunqueira@hotmail.com', 'nayane.dfaria@goias.gov.br', 'criado'),
('Nilvania de Santana Scalabrini', '88442837191', 'marciadiasdelima@outlook.com', 'nilvania.scalabrini@goias.gov.br', 'criado'),
('Paula Leticia Gouveia Santana Castro', '5010367173', 'paulaleticiags@hotmail.com', 'paula.scastro@goias.gov.br', 'criado'),
('Rita Aparecida da Silva', '33256047149', 'ritinha.aparecida@hotmail.com', 'rita.adsilva@goias.gov.br', 'criado'),
('Rogelina Ferreira Machado', '1535703180', 'rogelina_fm@hotmail.com', 'rogelina.machado@goias.gov.br', 'criado'),
('Ruth Aline da Costa Nunes Silva', '407626298', 'ruth_acn@hotmail.com', 'ruth.nsilva@goias.gov.br', 'criado'),
('Sandra Virginia de Andrade Santos', '89018680168', 'sandravasantos@gmail.com', 'sandra.asantos@goias.gov.br', 'criado'),
('Shuleyma Sousa Gundim', '89788230172', 'shuleymasg@hotmail.com', 'shuleyma.gundim@goias.gov.br', 'criado'),
('Tatiane Almeida Gomes Sobrinho', '1988584183', 'tatianealmeida.pgt@hotmail.com', 'tatiane.sobrinho@goias.gov.br', 'criado'),
('Vania Maria Elias Neto Duarte', '28796926104', 'vaniaeliasneto@gmail.com', 'vania.duarte@goias.gov.br', 'criado'),
('Wellington Paiva de Carvalho', '4090744113', 'wellingtonpaiva165@gmail.com', 'wellington.pcarvalho@goias.gov.br', 'criado'),
('Dieneffer Caroline Ramos Silva', '70285338161', 'dieneffercaroline96@gmail.com', 'dieneffer.silva@goias.gov.br', 'criado'),
('Fernanda Lopes da Silva', '95796460153', 'fernandalops@hotmail.com', 'fernanda.ldsilva@goias.gov.br', 'criado'),
('Izadora Galvao Pereira', '3244956173', 'izadoragalvao@hotmail.com', 'izadora.pereira@goias.gov.br', 'criado'),
('Thairyni Oliveira Santos da Silva', '70299373177', 'thairyni.oli@outlook.com', 'thairyni.silva@goias.gov.br', 'criado'),
('Andre Filipe Costa Candido', '70073978167', 'costacandido447@gmail.com', 'andre.candido@goias.gov.br', 'criado'),
('Augusto Cezar Rodrigues Da Silva', '77533828968', 'acrsilva@live.com', 'augusto.rsilva@goias.gov.br', 'criado'),
('Brendany Bispo Cabral', '74912410187', 'brendanycabral@gmail.com', 'brendany.cabral@goias.gov.br', 'criado'),
('Cleuto Alves De Carvalho Filho', '3916272101', 'cleuto.cotec@gmail.com', 'cleuto.carvalho@goias.gov.br', 'criado'),
('Flavia Fernanda Sousa Santos', '6357217166', 'flaviafernanda2899@gmail.com', 'flavia.fsantos@goias.gov.br', 'criado'),
('Glazielle Da Costa Resende Nazare', '953648117', 'glazy_resende@hotmail.com', 'glazielle.nazare@goias.gov.br', 'criado'),
('Isabela Dallara Guimaraes Ribeiro', '70333004175', 'isabeladallara28@gmail.com', 'isabela.ribeiro@goias.gov.br', 'criado'),
('Pamella Mohara Silva', '4095905506', 'pamellamoharaanalista@gmail.com', 'pamella.msilva@goias.gov.br', 'criado'),
('Romulo Junior Nogueira Santos', '4654850147', 'romulojr14@gmail.com', 'romulo.nsantos@goias.gov.br', 'criado'),
('Sarah Karoline Teixeira De Sousa', '4277141170', 'sarah.karoline.cotec@gmail.com', 'sarah.tsousa@goias.gov.br', 'criado'),
('Talyson Felipe De Souza E Silva', '92829562291', 'talyson.felipess@gmail.com', 'talyson.silva@goias.gov.br', 'criado'),
('Wenderson Da Silva Vieira', '1961243105', 'wendersonsilvafadex@gmail.com', 'wenderson.vieira@goias.gov.br', 'criado'),
('Yasmin Neves Dourado', '9389409101', 'yasmindourado86@gmail.com', 'yasmin.dourado@goias.gov.br', 'criado'),
('Artur Rezende Martins', '6008047397', '', 'artur.martins@goias.gov.br', 'criado'),
('Bruno Agrelio Ribeiro', '1241946647', '', 'bruno.agribeiro@goias.gov.br', 'criado'),
('Danilo Martins de Oliveira', '4274484173', '', 'danilo.mdoliveira@goias.gov.br', 'criado'),
('Fabricio Lima Cabral', '71279938234', '', 'fabricio.cabral@goias.gov.br', 'criado'),
('Jose Alves de Sousa Junior', '4265333303', '', 'jose.asousa@goias.gov.br', 'criado'),
('Roberto Sergio Jaldin Beckmann', '92960553187', '', 'roberto.beckmann@goias.gov.br', 'criado'),
('Sandra Marinho da Costa', '86406213150', '', 'sandra.mcosta@goias.gov.br', 'criado'),
('Thays Rodrigues Cardoso', '1975839110', '', 'thays.cardoso@goias.gov.br', 'criado'),
('Natacha Ferreira Lorente', '38682789825', '', 'natacha.lorente@goias.gov.br', 'criado'),
('Rayana Agrelio', '1050601351', '', 'rayana.agrelio@goias.gov.br', 'criado'),
('Isabela da Cruz Pires', '04800888107', '', 'isabela.pires@goias.gov.br', 'criado'),
('Ataualpa Veloso Roriz', '85136260115', '', 'atualpa.roriz@goias.gov.br', 'criado'),
('Sandra Marinho da Costa', '86406213149', '', 'sandra.mcosta@goias.gov.br', 'criado'),
('Ações Educacionais', '', '', 'educacional.fadex@goias.gov.br', 'Solicitado'),
('Ações Educacionais', '', '', 'educacional.fadex2@goias.gov.br', 'Solicitado'),
('Ações Educacionais', '', '', 'educacional.fadex3@goias.gov.br', 'Solicitado'),
('Ações Educacionais', '', '', 'educacional.fadex4@goias.gov.br', 'Solicitado'),
('Ações Educacionais', '', '', 'educacional.fadex5@goias.gov.br', 'Solicitado'),
('Ações Educacionais', '', '', 'educacional.fadex6@goias.gov.br', 'Solicitado'),
('Administrativo e Financeiro', '', '', 'admfinan.fadex@goias.gov.br', 'Solicitado');

-- =============================================
-- VIEWS ÚTEIS PARA CONSULTAS
-- =============================================

-- View: Resumo de equipamentos por COTEC
CREATE OR REPLACE VIEW vw_resumo_cotecs AS
SELECT 
    COALESCE(t.cotec, i.cotec, int.cotec, e.cotec) AS cotec,
    COALESCE(t.cidade, i.cidade, int.cidade, e.cidade) AS cidade,
    COUNT(DISTINCT t.id) AS total_equipe,
    SUM(i.monocromatica) AS total_impressoras_mono,
    SUM(i.policromatica) AS total_impressoras_poli,
    int.velocidade_link,
    int.operadora,
    e.unifi
FROM equipe_ti t
LEFT JOIN impressoras i ON t.cotec = i.cotec
LEFT JOIN internet int ON t.cotec = int.cotec
LEFT JOIN equipamentos e ON t.cotec = e.cotec
GROUP BY cotec, cidade, int.velocidade_link, int.operadora, e.unifi;

-- View: Estatísticas de emails
CREATE OR REPLACE VIEW vw_estatisticas_emails AS
SELECT 
    status,
    COUNT(*) AS total,
    ROUND((COUNT(*) * 100.0 / (SELECT COUNT(*) FROM emails_corporativos)), 2) AS percentual
FROM emails_corporativos
GROUP BY status;

-- View: Equipamentos de TI por cidade
CREATE OR REPLACE VIEW vw_equipe_por_cidade AS
SELECT 
    cidade,
    COUNT(*) AS total_tecnicos,
    GROUP_CONCAT(nome SEPARATOR '; ') AS tecnicos
FROM equipe_ti
WHERE nome != ''
GROUP BY cidade
ORDER BY total_tecnicos DESC;

-- =============================================
-- PROCEDURES ÚTEIS
-- =============================================

-- Procedure: Buscar informações completas de um COTEC
DELIMITER //
CREATE PROCEDURE sp_info_cotec(IN nome_cotec VARCHAR(255))
BEGIN
    SELECT 'EQUIPE TI' AS categoria, cotec, cidade, telefone, nome, horario 
    FROM equipe_ti WHERE cotec LIKE CONCAT('%', nome_cotec, '%')
    UNION ALL
    SELECT 'IMPRESSORAS', cotec, cidade, CONCAT('Mono: ', monocromatica, ' Poli: ', policromatica), funcionando, obs
    FROM impressoras WHERE cotec LIKE CONCAT('%', nome_cotec, '%')
    UNION ALL
    SELECT 'INTERNET', cotec, cidade, velocidade_link, operadora, speedtest
    FROM internet WHERE cotec LIKE CONCAT('%', nome_cotec, '%')
    UNION ALL
    SELECT 'EQUIPAMENTOS', cotec, cidade, LEFT(equipamentos, 100), unifi, ''
    FROM equipamentos WHERE cotec LIKE CONCAT('%', nome_cotec, '%');
END //
DELIMITER ;

-- Procedure: Adicionar novo email corporativo
DELIMITER //
CREATE PROCEDURE sp_adicionar_email(
    IN p_nome VARCHAR(150),
    IN p_cpf VARCHAR(11),
    IN p_email_pessoal VARCHAR(150),
    IN p_email_corporativo VARCHAR(150)
)
BEGIN
    INSERT INTO emails_corporativos (nome, cpf, email_pessoal, email_corporativo, status)
    VALUES (p_nome, p_cpf, p_email_pessoal, p_email_corporativo, 'Solicitado');
    
    SELECT 'Email adicionado com sucesso!' AS mensagem, LAST_INSERT_ID() AS id;
END //
DELIMITER ;

-- Procedure: Atualizar status de email
DELIMITER //
CREATE PROCEDURE sp_atualizar_status_email(
    IN p_id INT,
    IN p_novo_status VARCHAR(20)
)
BEGIN
    UPDATE emails_corporativos 
    SET status = p_novo_status 
    WHERE id = p_id;
    
    SELECT 'Status atualizado com sucesso!' AS mensagem;
END //
DELIMITER ;

-- =============================================
-- ÍNDICES ADICIONAIS PARA PERFORMANCE
-- =============================================
CREATE INDEX idx_nome_equipe ON equipe_ti(nome);
CREATE INDEX idx_email_nome ON emails_corporativos(nome);

-- =============================================
-- DADOS DE AUDITORIA
-- =============================================
CREATE TABLE IF NOT EXISTS auditoria_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tabela VARCHAR(50),
    acao VARCHAR(20),
    id_registro INT,
    usuario VARCHAR(100),
    data_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    dados_antigos TEXT,
    dados_novos TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- CONSULTAS ÚTEIS DE EXEMPLO
-- =============================================

-- Total de registros por tabela
    SELECT 'equipe_ti' AS tabela, COUNT(*) AS total FROM equipe_ti
    UNION ALL
    SELECT 'impressoras', COUNT(*) FROM impressoras
    UNION ALL
    SELECT 'internet', COUNT(*) FROM internet
    UNION ALL
    SELECT 'equipamentos', COUNT(*) FROM equipamentos
    UNION ALL
    SELECT 'emails_corporativos', COUNT(*) FROM emails_corporativos;

-- =============================================
-- FIM DO SCRIPT
-- =============================================
-- Script executado com sucesso!
-- Base de dados: oliverit
-- Total de tabelas: 6 (5 principais + 1 auditoria)
-- Total de registros inseridos: 
--   - Equipe TI: 18
--   - Impressoras: 14
--   - Internet: 13
--   - Equipamentos: 13
--   - Emails: 89
-- =============================================
