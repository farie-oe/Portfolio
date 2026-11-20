window.NETWORKING = {
  categories: [
    {
      id: 'addressing-routing',
      title: 'IP Addressing & Routing',
      summary: 'IPv4 addressing, subnetting and static routing labs in Cisco Packet Tracer.',
      kind: 'Hands-on lab',
      overview:
        'Hands-on Cisco Packet Tracer labs covering IPv4 addressing, subnetting and static routing.',
      involved: [
        'Assigning IPv4 addresses and subnet masks to router interfaces, PCs and servers',
        'Dividing 193.64.33.0/24 into /25, /26 and /27 subnets in the first three labs',
        'Linking routers over serial connections',
        'Configuring static and default routes between the routers',
        'Summarising two networks into one route in the static routing lab',
      ],
      concepts: [
        'IPv4 addressing',
        'Subnetting',
        'Static routing',
        'Default routes',
        'Route summarisation',
        'Serial links',
      ],
      approach:
        'Worked from the provided requirements and carried out the configuration myself in Cisco Packet Tracer.',
      exercises: [
        {
          id: 'ipv4-addressing-router-configuration',
          title: 'IPv4 Addressing & Router Configuration',
          summary:
            'Two LANs behind R2 addressed from 193.64.33.0/24 as two /25 subnets, with R1 linked to R2 over a serial connection in 200.0.0.0/24. R1 has static routes to both LANs via R2.',
          file: {
            name: 'IPV4_addressing.pkt',
            src: 'assets/networking/files/ipv4-addressing.pkt',
          },
          topology: {
            nodes: [
              {
                id: 'R1',
                label: 'R1',
                kind: 'router',
                x: 403,
                y: 425,
              },
              {
                id: 'R2',
                label: 'R2',
                kind: 'router',
                x: 705,
                y: 420,
              },
              {
                id: 'S1',
                label: 'S1',
                kind: 'switch',
                x: 920,
                y: 297,
              },
              {
                id: 'S2',
                label: 'S2',
                kind: 'switch',
                x: 926,
                y: 558,
              },
              {
                id: 'PC1',
                label: 'PC1',
                kind: 'pc',
                x: 1216,
                y: 296,
              },
              {
                id: 'PC2',
                label: 'PC2',
                kind: 'pc',
                x: 1218,
                y: 555,
              },
            ],
            links: [
              {
                a: 'PC1',
                b: 'S1',
              },
              {
                a: 'PC2',
                b: 'S2',
              },
              {
                a: 'R2',
                b: 'S1',
              },
              {
                a: 'R2',
                b: 'S2',
              },
              {
                a: 'R1',
                b: 'R2',
              },
            ],
          },
          facts: [
            {
              title: 'Router interfaces',
              headers: ['Router', 'Interface', 'Address'],
              rows: [
                ['R1', 'Serial2/0', '200.0.0.2/24'],
                ['R2', 'FastEthernet0/0', '193.64.33.1/25'],
                ['R2', 'FastEthernet1/0', '193.64.33.129/25'],
                ['R2', 'Serial2/0', '200.0.0.1/24'],
              ],
            },
            {
              title: 'Hosts',
              headers: ['Device', 'Address', 'Default gateway'],
              rows: [
                ['PC1', '193.64.33.126/25', '193.64.33.1'],
                ['PC2', '193.64.33.254/25', '193.64.33.129'],
              ],
            },
            {
              title: 'Static routes',
              headers: ['Router', 'Destination', 'Next hop'],
              rows: [
                ['R1', '193.64.33.0/25', '200.0.0.1'],
                ['R1', '193.64.33.128/25', '200.0.0.1'],
              ],
            },
          ],
        },
        {
          id: 'subnetting-network-segmentation',
          title: 'Subnetting & Network Segmentation',
          summary:
            'A three-router network (ISP, BR and HQ) addressed with /27 subnets from 193.64.33.0/24. BR connects a DNS server LAN and an HTTP server LAN, and HQ connects three LANs behind the switches SA, FS and HR. BR and HQ have default routes, BR has static routes toward HQ, and the ISP has a route back to 193.64.33.0/24.',
          file: {
            name: '8 subnets prac.pkt',
            src: 'assets/networking/files/eight-subnets-prac.pkt',
          },
          topology: {
            nodes: [
              {
                id: 'ISP',
                label: 'ISP',
                kind: 'router',
                x: 401,
                y: 368,
              },
              {
                id: 'BR',
                label: 'BR',
                kind: 'router',
                x: 743,
                y: 368,
              },
              {
                id: 'HQ',
                label: 'HQ',
                kind: 'router',
                x: 1142,
                y: 371,
              },
              {
                id: 'SE1',
                label: 'SE1',
                kind: 'switch',
                x: 740,
                y: 512,
              },
              {
                id: 'SA',
                label: 'SA',
                kind: 'switch',
                x: 1148,
                y: 520,
              },
              {
                id: 'SE2',
                label: 'SE2',
                kind: 'switch',
                x: 742,
                y: 274,
              },
              {
                id: 'FS',
                label: 'FS',
                kind: 'switch',
                x: 1144,
                y: 269,
              },
              {
                id: 'HR',
                label: 'HR',
                kind: 'switch',
                x: 1368,
                y: 368,
              },
              {
                id: 'DNS',
                label: 'DNS',
                kind: 'server',
                x: 740,
                y: 660,
              },
              {
                id: 'HTTP',
                label: 'HTTP',
                kind: 'server',
                x: 737,
                y: 85,
              },
              {
                id: 'SA-PC1',
                label: 'SA-PC1',
                kind: 'pc',
                x: 1148,
                y: 682,
              },
              {
                id: 'HR-PC1',
                label: 'HR-PC1',
                kind: 'pc',
                x: 1554,
                y: 370,
              },
              {
                id: 'FS-PC1',
                label: 'FS-PC1',
                kind: 'pc',
                x: 1140,
                y: 91,
              },
            ],
            links: [
              {
                a: 'ISP',
                b: 'BR',
              },
              {
                a: 'BR',
                b: 'HQ',
              },
              {
                a: 'DNS',
                b: 'SE1',
              },
              {
                a: 'SE1',
                b: 'BR',
              },
              {
                a: 'HTTP',
                b: 'SE2',
              },
              {
                a: 'SE2',
                b: 'BR',
              },
              {
                a: 'HQ',
                b: 'SA',
              },
              {
                a: 'SA',
                b: 'SA-PC1',
              },
              {
                a: 'HQ',
                b: 'FS',
              },
              {
                a: 'FS',
                b: 'FS-PC1',
              },
              {
                a: 'HR-PC1',
                b: 'HR',
              },
              {
                a: 'HQ',
                b: 'HR',
              },
            ],
          },
          facts: [
            {
              title: 'Router interfaces',
              headers: ['Router', 'Interface', 'Address'],
              rows: [
                ['ISP', 'Serial2/0', '200.0.0.2/24'],
                ['BR', 'FastEthernet0/0', '193.64.33.33/27'],
                ['BR', 'FastEthernet1/0', '193.64.33.65/27'],
                ['BR', 'Serial2/0', '200.0.0.1/24'],
                ['BR', 'Serial3/0', '193.64.33.1/27'],
                ['HQ', 'FastEthernet0/0', '193.64.33.161/27'],
                ['HQ', 'FastEthernet1/0', '193.64.33.193/27'],
                ['HQ', 'Serial2/0', '193.64.33.2/27'],
                ['HQ', 'FastEthernet4/0', '193.64.33.225/27'],
              ],
            },
            {
              title: 'Hosts',
              headers: ['Device', 'Address', 'Default gateway'],
              rows: [
                ['DNS', '193.64.33.34/27', '193.64.33.33'],
                ['HTTP', '193.64.33.66/27', '193.64.33.65'],
                ['SA-PC1', '193.64.33.190/27', '193.64.33.161'],
                ['HR-PC1', '193.64.33.254/27', '193.64.33.225'],
                ['FS-PC1', '193.64.33.222/27', '193.64.33.193'],
              ],
            },
            {
              title: 'Static routes',
              headers: ['Router', 'Destination', 'Next hop'],
              rows: [
                ['ISP', '193.64.33.0/24', '200.0.0.1'],
                ['BR', '193.64.33.192/26', '193.64.33.2'],
                ['BR', '193.64.33.160/27', '193.64.33.2'],
                ['BR', 'Default route', '200.0.0.2'],
                ['HQ', 'Default route', '193.64.33.1'],
              ],
            },
          ],
        },
        {
          id: 'multi-network-subnetting-routing',
          title: 'Multi-Network Subnetting & Routing',
          summary:
            'The ISP, BR and HQ network addressed with /26 subnets. BR serves a DNS server and an HTTP server, and HQ serves four PCs on two LANs. The saved routes are default routes on BR and HQ, a route on BR toward 193.64.33.128/25, and a route on the ISP back to 193.64.33.0/24.',
          file: {
            name: 'Lab4.1 - (exam style).pkt',
            src: 'assets/networking/files/lab4-1-exam-style.pkt',
          },
          topology: {
            nodes: [
              {
                id: 'ISP',
                label: 'ISP',
                kind: 'router',
                x: 487,
                y: 244,
              },
              {
                id: 'BR',
                label: 'BR',
                kind: 'router',
                x: 736,
                y: 240,
              },
              {
                id: 'HQ',
                label: 'HQ',
                kind: 'router',
                x: 1114,
                y: 229,
              },
              {
                id: 'SE',
                label: 'SE',
                kind: 'switch',
                x: 738,
                y: 405,
              },
              {
                id: 'SA',
                label: 'SA',
                kind: 'switch',
                x: 1010,
                y: 399,
              },
              {
                id: 'HR',
                label: 'HR',
                kind: 'switch',
                x: 1234,
                y: 396,
              },
              {
                id: 'DNS',
                label: 'DNS',
                kind: 'server',
                x: 645,
                y: 539,
              },
              {
                id: 'HTTP',
                label: 'HTTP',
                kind: 'server',
                x: 816,
                y: 533,
              },
              {
                id: 'PC0',
                label: 'PC0',
                kind: 'pc',
                x: 964,
                y: 537,
              },
              {
                id: 'PC1',
                label: 'PC1',
                kind: 'pc',
                x: 1054,
                y: 531,
              },
              {
                id: 'PC2',
                label: 'PC2',
                kind: 'pc',
                x: 1208,
                y: 520,
              },
              {
                id: 'PC3',
                label: 'PC3',
                kind: 'pc',
                x: 1290,
                y: 521,
              },
            ],
            links: [
              {
                a: 'BR',
                b: 'HQ',
              },
              {
                a: 'DNS',
                b: 'SE',
              },
              {
                a: 'HTTP',
                b: 'SE',
              },
              {
                a: 'BR',
                b: 'SE',
              },
              {
                a: 'PC0',
                b: 'SA',
              },
              {
                a: 'PC1',
                b: 'SA',
              },
              {
                a: 'SA',
                b: 'HQ',
              },
              {
                a: 'PC2',
                b: 'HR',
              },
              {
                a: 'PC3',
                b: 'HR',
              },
              {
                a: 'HR',
                b: 'HQ',
              },
              {
                a: 'ISP',
                b: 'BR',
              },
            ],
          },
          facts: [
            {
              title: 'Router interfaces',
              headers: ['Router', 'Interface', 'Address'],
              rows: [
                ['ISP', 'Serial2/0', '200.0.0.2/24'],
                ['BR', 'FastEthernet0/0', '193.64.33.65/26'],
                ['BR', 'Serial2/0', '200.0.0.1/24'],
                ['BR', 'Serial3/0', '193.64.33.1/26'],
                ['HQ', 'FastEthernet0/0', '193.64.33.129/26'],
                ['HQ', 'FastEthernet1/0', '193.64.33.193/26'],
                ['HQ', 'Serial2/0', '193.64.33.2/26'],
              ],
            },
            {
              title: 'Hosts',
              headers: ['Device', 'Address', 'Default gateway'],
              rows: [
                ['DNS', '193.64.33.66/26', '193.64.33.65'],
                ['HTTP', '193.64.33.67/26', '193.64.33.65'],
                ['PC0', '193.64.33.130/26', '193.64.33.129'],
                ['PC1', '193.64.33.190/26', '193.64.33.129'],
                ['PC2', '193.64.33.194/26', '193.64.33.193'],
                ['PC3', '193.64.33.254/26', '193.64.33.193'],
              ],
            },
            {
              title: 'Static routes',
              headers: ['Router', 'Destination', 'Next hop'],
              rows: [
                ['ISP', '193.64.33.0/24', '200.0.0.1'],
                ['BR', 'Default route', '200.0.0.2'],
                ['BR', '193.64.33.128/25', '193.64.33.129'],
                ['HQ', 'Default route', '193.64.33.1'],
              ],
            },
          ],
        },
        {
          id: 'static-routing-route-summarisation',
          title: 'Static Routing & Route Summarisation',
          summary:
            'Three routers (ISP, R1 and R2) with 192.0.x.0/24 networks. R1 connects the HTTP server LAN and R2 connects two PC LANs. R1 has a default route and a summary route 192.0.2.0/23 via R2, R2 has a default route, and the ISP has a static route to each of the four networks.',
          file: {
            name: 'Lab5.1.pkt',
            src: 'assets/networking/files/lab5-1.pkt',
          },
          topology: {
            nodes: [
              {
                id: 'R1',
                label: 'R1',
                kind: 'router',
                x: 626,
                y: 208,
              },
              {
                id: 'R2',
                label: 'R2',
                kind: 'router',
                x: 1027,
                y: 201,
              },
              {
                id: 'ISP',
                label: 'ISP',
                kind: 'router',
                x: 324,
                y: 217,
              },
              {
                id: 'S1',
                label: 'S1',
                kind: 'switch',
                x: 626,
                y: 367,
              },
              {
                id: 'S2',
                label: 'S2',
                kind: 'switch',
                x: 938,
                y: 354,
              },
              {
                id: 'S3',
                label: 'S3',
                kind: 'switch',
                x: 1116,
                y: 350,
              },
              {
                id: 'HTTP server',
                label: 'HTTP server',
                kind: 'server',
                x: 627,
                y: 508,
              },
              {
                id: 'PC1',
                label: 'PC1',
                kind: 'pc',
                x: 912,
                y: 517,
              },
              {
                id: 'PC2',
                label: 'PC2',
                kind: 'pc',
                x: 1144,
                y: 515,
              },
            ],
            links: [
              {
                a: 'R1',
                b: 'ISP',
              },
              {
                a: 'R2',
                b: 'R1',
              },
              {
                a: 'S1',
                b: 'R1',
              },
              {
                a: 'S3',
                b: 'R2',
              },
              {
                a: 'HTTP server',
                b: 'S1',
              },
              {
                a: 'PC1',
                b: 'S2',
              },
              {
                a: 'PC2',
                b: 'S3',
              },
              {
                a: 'R2',
                b: 'S2',
              },
            ],
          },
          facts: [
            {
              title: 'Router interfaces',
              headers: ['Router', 'Interface', 'Address'],
              rows: [
                ['R1', 'FastEthernet0/0', '192.0.1.1/24'],
                ['R1', 'Serial2/0', '200.0.0.1/24'],
                ['R1', 'Serial3/0', '192.0.0.1/24'],
                ['R2', 'FastEthernet0/0', '192.0.2.1/24'],
                ['R2', 'FastEthernet1/0', '192.0.3.1/24'],
                ['R2', 'Serial2/0', '192.0.0.2/24'],
                ['ISP', 'Serial2/0', '200.0.0.2/24'],
              ],
            },
            {
              title: 'Hosts',
              headers: ['Device', 'Address', 'Default gateway'],
              rows: [
                ['HTTP server', '192.0.1.5/24', '192.0.1.1'],
                ['PC1', '192.0.2.11/24', '192.0.2.1'],
                ['PC2', '192.0.3.22/24', '192.0.3.1'],
              ],
            },
            {
              title: 'Static routes',
              headers: ['Router', 'Destination', 'Next hop'],
              rows: [
                ['R1', 'Default route', '200.0.0.2'],
                ['R1', '192.0.2.0/23', '192.0.0.2'],
                ['R2', 'Default route', '192.0.0.1'],
                ['ISP', '192.0.1.0/24', '200.0.0.1'],
                ['ISP', '192.0.0.0/24', '200.0.0.1'],
                ['ISP', '192.0.2.0/24', '200.0.0.1'],
                ['ISP', '192.0.3.0/24', '200.0.0.1'],
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'services',
      title: 'Network Services',
      summary: 'A staged lab building DHCP, DNS, web and email services.',
      kind: 'Hands-on lab',
      overview:
        'A staged Cisco Packet Tracer lab that builds up a small two-LAN network with DHCP, DNS, web and email services. Each stage keeps the same base network and changes only what is listed.',
      involved: [
        'Configuring a DHCP pool on a server for the 192.168.1.0/24 LAN',
        'Adding a DNS server with an A record and a CNAME record',
        'Pointing the DNS name apple at the server at 192.168.2.3',
        'Setting up an email server for apple.com with two accounts, and email clients on two PCs',
      ],
      concepts: ['DHCP', 'DNS', 'A and CNAME records', 'SMTP', 'POP3', 'Email clients'],
      approach:
        'Worked from the provided requirements and carried out the configuration myself in Cisco Packet Tracer.',
      exercises: [
        {
          id: 'network-services-configuration',
          title: 'Network Services Configuration',
          summary:
            'Four stages on one base network: a DHCP server, then DNS records, then a named web server, then an email server.',
          stages: [
            {
              id: 'dhcp',
              title: 'DHCP server',
              summary:
                'A DHCP server on the 192.168.1.0/24 LAN, a router joining it to 192.168.2.0/24, and a PC on the second LAN with a static address.',
              file: {
                name: 'Lab7.1.pkt',
                src: 'assets/networking/files/lab7-1.pkt',
              },
              topology: {
                nodes: [
                  {
                    id: 'Switch1',
                    label: 'Switch1',
                    kind: 'switch',
                    x: 1180,
                    y: 351,
                  },
                  {
                    id: 'Server0',
                    label: 'Server0',
                    kind: 'server',
                    x: 592,
                    y: 570,
                  },
                  {
                    id: 'PC2',
                    label: 'PC2',
                    kind: 'pc',
                    x: 302,
                    y: 562,
                  },
                  {
                    id: 'PC1',
                    label: 'PC1',
                    kind: 'pc',
                    x: 274,
                    y: 359,
                  },
                  {
                    id: 'PC3',
                    label: 'PC3',
                    kind: 'pc',
                    x: 360,
                    y: 175,
                  },
                  {
                    id: 'PC4',
                    label: 'PC4',
                    kind: 'pc',
                    x: 1182,
                    y: 591,
                  },
                  {
                    id: 'Switch2',
                    label: 'Switch2',
                    kind: 'switch',
                    x: 595,
                    y: 359,
                  },
                  {
                    id: 'Router0',
                    label: 'Router0',
                    kind: 'router',
                    x: 890,
                    y: 354,
                  },
                ],
                links: [
                  {
                    a: 'Switch1',
                    b: 'PC4',
                  },
                  {
                    a: 'Server0',
                    b: 'Switch2',
                  },
                  {
                    a: 'PC2',
                    b: 'Switch2',
                  },
                  {
                    a: 'PC1',
                    b: 'Switch2',
                  },
                  {
                    a: 'PC3',
                    b: 'Switch2',
                  },
                  {
                    a: 'Switch2',
                    b: 'Router0',
                  },
                  {
                    a: 'Router0',
                    b: 'Switch1',
                  },
                ],
              },
              facts: [
                {
                  title: 'Servers and services',
                  headers: ['Server', 'Address', 'Configured'],
                  rows: [
                    [
                      'Server0',
                      '192.168.1.2/24',
                      [
                        'DHCP pool serverPool: 192.168.1.0/24, gateway 192.168.1.1, DNS 192.168.2.2, starting at 192.168.1.100, up to 100 users',
                      ],
                    ],
                  ],
                },
                {
                  title: 'Router interfaces',
                  headers: ['Router', 'Interface', 'Address'],
                  rows: [
                    ['Router0', 'GigabitEthernet0/0', '192.168.1.1/24'],
                    ['Router0', 'GigabitEthernet0/1', '192.168.2.1/24'],
                  ],
                },
                {
                  title: 'PCs',
                  headers: ['Device', 'Address', 'Default gateway'],
                  rows: [
                    ['PC2', 'No static address stored', '192.168.1.1'],
                    ['PC1', 'No static address stored', '192.168.1.1'],
                    ['PC3', 'No static address stored', '192.168.1.1'],
                    ['PC4', '192.168.2.100/24', '192.168.2.1'],
                  ],
                },
              ],
            },
            {
              id: 'dns',
              title: 'DNS records',
              summary:
                'Adds a DNS server on the second LAN with an A record and a CNAME for apple, and a server named apple at 192.168.2.3.',
              file: {
                name: 'Lab7.2.pkt',
                src: 'assets/networking/files/lab7-2.pkt',
              },
              topology: {
                nodes: [
                  {
                    id: 'Server0 (DHCP)',
                    label: 'Server0 (DHCP)',
                    kind: 'server',
                    x: 591,
                    y: 570,
                  },
                  {
                    id: 'PC2',
                    label: 'PC2',
                    kind: 'pc',
                    x: 302,
                    y: 562,
                  },
                  {
                    id: 'PC1',
                    label: 'PC1',
                    kind: 'pc',
                    x: 274,
                    y: 359,
                  },
                  {
                    id: 'PC3',
                    label: 'PC3',
                    kind: 'pc',
                    x: 360,
                    y: 175,
                  },
                  {
                    id: 'PC4',
                    label: 'PC4',
                    kind: 'pc',
                    x: 1172,
                    y: 592,
                  },
                  {
                    id: 'Switch2',
                    label: 'Switch2',
                    kind: 'switch',
                    x: 594,
                    y: 359,
                  },
                  {
                    id: 'Router0',
                    label: 'Router0',
                    kind: 'router',
                    x: 890,
                    y: 354,
                  },
                  {
                    id: 'Server2(apple)',
                    label: 'Server2(apple)',
                    kind: 'server',
                    x: 1447,
                    y: 358,
                  },
                  {
                    id: 'Server 1 (DNS)',
                    label: 'Server 1 (DNS)',
                    kind: 'server',
                    x: 1174,
                    y: 125,
                  },
                  {
                    id: 'Switch0',
                    label: 'Switch0',
                    kind: 'switch',
                    x: 1175,
                    y: 362,
                  },
                ],
                links: [
                  {
                    a: 'Server0 (DHCP)',
                    b: 'Switch2',
                  },
                  {
                    a: 'PC2',
                    b: 'Switch2',
                  },
                  {
                    a: 'PC1',
                    b: 'Switch2',
                  },
                  {
                    a: 'PC3',
                    b: 'Switch2',
                  },
                  {
                    a: 'Switch2',
                    b: 'Router0',
                  },
                  {
                    a: 'Router0',
                    b: 'Switch0',
                  },
                  {
                    a: 'PC4',
                    b: 'Switch0',
                  },
                  {
                    a: 'Server2(apple)',
                    b: 'Switch0',
                  },
                  {
                    a: 'Server 1 (DNS)',
                    b: 'Switch0',
                  },
                ],
              },
              facts: [
                {
                  title: 'Servers and services',
                  headers: ['Server', 'Address', 'Configured'],
                  rows: [
                    [
                      'Server0 (DHCP)',
                      '192.168.1.2/24',
                      [
                        'DHCP pool serverPool: 192.168.1.0/24, gateway 192.168.1.1, DNS 192.168.2.2, starting at 192.168.1.100, up to 100 users',
                      ],
                    ],
                    [
                      'Server 1 (DNS)',
                      '192.168.2.2/24',
                      ['DNS A record: apple → 192.168.2.3', 'DNS CNAME: apple.com → apple'],
                    ],
                  ],
                },
                {
                  title: 'Router interfaces',
                  headers: ['Router', 'Interface', 'Address'],
                  rows: [
                    ['Router0', 'GigabitEthernet0/0', '192.168.1.1/24'],
                    ['Router0', 'GigabitEthernet0/1', '192.168.2.1/24'],
                  ],
                },
                {
                  title: 'PCs',
                  headers: ['Device', 'Address', 'Default gateway'],
                  rows: [
                    ['PC2', 'No static address stored', '192.168.1.1'],
                    ['PC1', 'No static address stored', '192.168.1.1'],
                    ['PC3', 'No static address stored', '192.168.1.1'],
                    ['PC4', '192.168.2.100/24', '—'],
                  ],
                },
              ],
            },
            {
              id: 'web',
              title: 'Web server',
              summary:
                'The DNS records are unchanged, and the server at 192.168.2.3 is now named HTTP Web Server (apple).',
              file: {
                name: 'Lab7.3.pkt',
                src: 'assets/networking/files/lab7-3.pkt',
              },
              topology: {
                nodes: [
                  {
                    id: 'Server0 (DHCP)',
                    label: 'Server0 (DHCP)',
                    kind: 'server',
                    x: 590,
                    y: 570,
                  },
                  {
                    id: 'PC2',
                    label: 'PC2',
                    kind: 'pc',
                    x: 302,
                    y: 562,
                  },
                  {
                    id: 'PC1',
                    label: 'PC1',
                    kind: 'pc',
                    x: 274,
                    y: 359,
                  },
                  {
                    id: 'PC3',
                    label: 'PC3',
                    kind: 'pc',
                    x: 360,
                    y: 175,
                  },
                  {
                    id: 'PC4',
                    label: 'PC4',
                    kind: 'pc',
                    x: 1172,
                    y: 592,
                  },
                  {
                    id: 'Switch2',
                    label: 'Switch2',
                    kind: 'switch',
                    x: 593,
                    y: 359,
                  },
                  {
                    id: 'Router0',
                    label: 'Router0',
                    kind: 'router',
                    x: 890,
                    y: 354,
                  },
                  {
                    id: 'HTTP Web Server (apple)',
                    label: 'HTTP Web Server (apple)',
                    kind: 'server',
                    x: 1446,
                    y: 358,
                  },
                  {
                    id: 'Server 1 (DNS)',
                    label: 'Server 1 (DNS)',
                    kind: 'server',
                    x: 1173,
                    y: 125,
                  },
                  {
                    id: 'Switch0',
                    label: 'Switch0',
                    kind: 'switch',
                    x: 1174,
                    y: 362,
                  },
                ],
                links: [
                  {
                    a: 'Server0 (DHCP)',
                    b: 'Switch2',
                  },
                  {
                    a: 'PC2',
                    b: 'Switch2',
                  },
                  {
                    a: 'PC1',
                    b: 'Switch2',
                  },
                  {
                    a: 'PC3',
                    b: 'Switch2',
                  },
                  {
                    a: 'Switch2',
                    b: 'Router0',
                  },
                  {
                    a: 'Router0',
                    b: 'Switch0',
                  },
                  {
                    a: 'PC4',
                    b: 'Switch0',
                  },
                  {
                    a: 'HTTP Web Server (apple)',
                    b: 'Switch0',
                  },
                  {
                    a: 'Server 1 (DNS)',
                    b: 'Switch0',
                  },
                ],
              },
              facts: [
                {
                  title: 'Servers and services',
                  headers: ['Server', 'Address', 'Configured'],
                  rows: [
                    [
                      'Server0 (DHCP)',
                      '192.168.1.2/24',
                      [
                        'DHCP pool serverPool: 192.168.1.0/24, gateway 192.168.1.1, DNS 192.168.2.2, starting at 192.168.1.100, up to 100 users',
                      ],
                    ],
                    [
                      'Server 1 (DNS)',
                      '192.168.2.2/24',
                      ['DNS A record: apple → 192.168.2.3', 'DNS CNAME: apple.com → apple'],
                    ],
                  ],
                },
                {
                  title: 'Router interfaces',
                  headers: ['Router', 'Interface', 'Address'],
                  rows: [
                    ['Router0', 'GigabitEthernet0/0', '192.168.1.1/24'],
                    ['Router0', 'GigabitEthernet0/1', '192.168.2.1/24'],
                  ],
                },
                {
                  title: 'PCs',
                  headers: ['Device', 'Address', 'Default gateway'],
                  rows: [
                    ['PC2', 'No static address stored', '192.168.1.1'],
                    ['PC1', 'No static address stored', '192.168.1.1'],
                    ['PC3', 'No static address stored', '192.168.1.1'],
                    ['PC4', '192.168.2.100/24', '—'],
                  ],
                },
              ],
            },
            {
              id: 'email',
              title: 'Email server',
              summary:
                'The server at 192.168.2.3 is now an SMTP server for apple.com with the accounts mango and pine, and email clients are set up on PC1 and PC4.',
              file: {
                name: 'Lab7.4.pkt',
                src: 'assets/networking/files/lab7-4.pkt',
              },
              topology: {
                nodes: [
                  {
                    id: 'Server0 (DHCP)',
                    label: 'Server0 (DHCP)',
                    kind: 'server',
                    x: 587,
                    y: 570,
                  },
                  {
                    id: 'PC2',
                    label: 'PC2',
                    kind: 'pc',
                    x: 302,
                    y: 562,
                  },
                  {
                    id: 'PC1',
                    label: 'PC1',
                    kind: 'pc',
                    x: 274,
                    y: 359,
                  },
                  {
                    id: 'PC3',
                    label: 'PC3',
                    kind: 'pc',
                    x: 360,
                    y: 175,
                  },
                  {
                    id: 'PC4',
                    label: 'PC4',
                    kind: 'pc',
                    x: 1172,
                    y: 592,
                  },
                  {
                    id: 'Switch2',
                    label: 'Switch2',
                    kind: 'switch',
                    x: 590,
                    y: 359,
                  },
                  {
                    id: 'Router0',
                    label: 'Router0',
                    kind: 'router',
                    x: 890,
                    y: 354,
                  },
                  {
                    id: 'SMTP server',
                    label: 'SMTP server',
                    kind: 'server',
                    x: 1443,
                    y: 358,
                  },
                  {
                    id: 'Server 1 (DNS)',
                    label: 'Server 1 (DNS)',
                    kind: 'server',
                    x: 1170,
                    y: 125,
                  },
                  {
                    id: 'Switch0',
                    label: 'Switch0',
                    kind: 'switch',
                    x: 1171,
                    y: 362,
                  },
                ],
                links: [
                  {
                    a: 'Server0 (DHCP)',
                    b: 'Switch2',
                  },
                  {
                    a: 'PC2',
                    b: 'Switch2',
                  },
                  {
                    a: 'PC1',
                    b: 'Switch2',
                  },
                  {
                    a: 'PC3',
                    b: 'Switch2',
                  },
                  {
                    a: 'Switch2',
                    b: 'Router0',
                  },
                  {
                    a: 'Router0',
                    b: 'Switch0',
                  },
                  {
                    a: 'PC4',
                    b: 'Switch0',
                  },
                  {
                    a: 'SMTP server',
                    b: 'Switch0',
                  },
                  {
                    a: 'Server 1 (DNS)',
                    b: 'Switch0',
                  },
                ],
              },
              facts: [
                {
                  title: 'Servers and services',
                  headers: ['Server', 'Address', 'Configured'],
                  rows: [
                    [
                      'Server0 (DHCP)',
                      '192.168.1.2/24',
                      [
                        'DHCP pool serverPool: 192.168.1.0/24, gateway 192.168.1.1, DNS 192.168.2.2, starting at 192.168.1.100, up to 100 users',
                      ],
                    ],
                    [
                      'SMTP server',
                      '192.168.2.3/24',
                      ['Email (SMTP and POP3) for apple.com, accounts: mango, pine'],
                    ],
                    [
                      'Server 1 (DNS)',
                      '192.168.2.2/24',
                      ['DNS A record: apple → 192.168.2.3', 'DNS CNAME: apple.com → apple'],
                    ],
                  ],
                },
                {
                  title: 'Router interfaces',
                  headers: ['Router', 'Interface', 'Address'],
                  rows: [
                    ['Router0', 'GigabitEthernet0/0', '192.168.1.1/24'],
                    ['Router0', 'GigabitEthernet0/1', '192.168.2.1/24'],
                  ],
                },
                {
                  title: 'PCs',
                  headers: ['Device', 'Address', 'Default gateway'],
                  rows: [
                    ['PC2', 'No static address stored', '—'],
                    ['PC1', 'No static address stored', '—'],
                    ['PC3', 'No static address stored', '—'],
                    ['PC4', '192.168.2.100/24', '—'],
                  ],
                },
                {
                  title: 'Email clients',
                  headers: ['PC', 'Account', 'Mail server'],
                  rows: [
                    ['PC1', 'mango@apple.com', '192.168.2.3'],
                    ['PC4', 'pine@apple.com', '192.168.2.3'],
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'design-iot',
      title: 'Network Design & IoT',
      summary: 'A simulated smart home network built in Cisco Packet Tracer.',
      kind: 'Hands-on lab',
      overview:
        'A hands-on Cisco Packet Tracer build that involved creating a simulated smart home environment.',
      exercises: [
        {
          id: 'smart-home-network-design',
          title: 'Smart Home Network Design & Configuration',
          summary: 'A simulated smart home environment created in Cisco Packet Tracer.',
          file: {
            name: 'Smart_Home_Network.pkt',
            src: 'assets/networking/files/smart-home-network.pkt',
          },
          topology: {
            nodes: [
              {
                id: 'Home Gateway',
                label: 'Home Gateway',
                kind: 'gateway',
                x: 486,
                y: 47,
              },
              {
                id: 'Cable Modem',
                label: 'Cable Modem',
                kind: 'modem',
                x: 382,
                y: 151,
              },
              {
                id: 'Smart Battery',
                label: 'Smart Battery',
                kind: 'iot',
                x: 746,
                y: 25,
              },
              {
                id: 'Smart Solar Panel',
                label: 'Smart Solar Panel',
                kind: 'iot',
                x: 598,
                y: 45,
              },
              {
                id: 'Temperature Meter',
                label: 'Temperature Meter',
                kind: 'iot',
                x: 475,
                y: 151,
              },
              {
                id: 'Smart Door',
                label: 'Smart Door',
                kind: 'iot',
                x: 726,
                y: 237,
              },
              {
                id: 'Garage Door',
                label: 'Garage Door',
                kind: 'iot',
                x: 1008,
                y: 269,
              },
              {
                id: 'Smoke Detector',
                label: 'Smoke Detector',
                kind: 'iot',
                x: 624,
                y: 194,
              },
              {
                id: 'Smart Coffee Maker',
                label: 'Smart Coffee Maker',
                kind: 'iot',
                x: 935,
                y: 131,
              },
              {
                id: 'Smart Lamp',
                label: 'Smart Lamp',
                kind: 'iot',
                x: 797,
                y: 138,
              },
              {
                id: 'Tablet',
                label: 'Tablet',
                kind: 'tablet',
                x: 458,
                y: 273,
              },
              {
                id: 'MCU',
                label: 'MCU',
                kind: 'mcu',
                x: 563,
                y: 294,
              },
              {
                id: 'Classic Car',
                label: 'Classic Car',
                kind: 'iot',
                x: 1036,
                y: 329,
              },
              {
                id: 'Smart Fan',
                label: 'Smart Fan',
                kind: 'iot',
                x: 254,
                y: 273,
              },
              {
                id: 'Cloud',
                label: 'Cloud',
                kind: 'cloud',
                x: 202,
                y: 182,
              },
              {
                id: 'Internet_Switch',
                label: 'Internet_Switch',
                kind: 'switch',
                x: 142,
                y: 280,
              },
              {
                id: 'Internet_Server',
                label: 'Internet_Server',
                kind: 'server',
                x: 111,
                y: 386,
              },
            ],
            links: [
              {
                a: 'Home Gateway',
                b: 'Cable Modem',
              },
              {
                a: 'Smart Solar Panel',
                b: 'Smart Battery',
              },
              {
                a: 'Smart Battery',
                b: 'Smart Coffee Maker',
              },
              {
                a: 'Smart Battery',
                b: 'Smart Lamp',
              },
              {
                a: 'Home Gateway',
                b: 'Smart Solar Panel',
              },
              {
                a: 'MCU',
                b: 'Smart Door',
              },
              {
                a: 'MCU',
                b: 'Garage Door',
              },
              {
                a: 'MCU',
                b: 'Smart Fan',
              },
              {
                a: 'Internet_Server',
                b: 'Internet_Switch',
              },
              {
                a: 'Internet_Switch',
                b: 'Cloud',
              },
              {
                a: 'Cloud',
                b: 'Cable Modem',
              },
            ],
          },
          facts: [
            {
              title: 'Components',
              headers: ['Name', 'Packet Tracer device'],
              rows: [
                ['Home Gateway', 'DLC100'],
                ['Cable Modem', 'Cable-Modem-PT'],
                ['Smart Battery', 'Battery'],
                ['Smart Solar Panel', 'Solar Panel'],
                ['Temperature Meter', 'Temperature Monitor'],
                ['Smart Door', 'Door'],
                ['Garage Door', 'Garage Door'],
                ['Smoke Detector', 'Smoke Detector'],
                ['Smart Coffee Maker', 'Appliance'],
                ['Smart Lamp', 'Light'],
                ['Tablet', 'TabletPC-PT'],
                ['MCU', 'MCU-PT'],
                ['Classic Car', 'Old Car'],
                ['Smart Fan', 'Fan'],
                ['Cloud', 'Cloud-PT-Empty'],
                ['Internet_Switch', '2960-24TT'],
                ['Internet_Server', 'Server-PT'],
              ],
            },
            {
              title: 'Cable connections',
              headers: ['From (port)', 'To (port)'],
              rows: [
                ['Home Gateway (Internet)', 'Cable Modem (Port 1)'],
                ['Smart Solar Panel (D0)', 'Smart Battery (D0)'],
                ['Smart Battery (D3)', 'Smart Coffee Maker (D0)'],
                ['Smart Battery (D2)', 'Smart Lamp (D0)'],
                ['Home Gateway (Ethernet 1)', 'Smart Solar Panel (GigabitEthernet0)'],
                ['MCU (D3)', 'Smart Door (D0)'],
                ['MCU (D5)', 'Garage Door (D0)'],
                ['MCU (D2)', 'Smart Fan (D0)'],
                ['Internet_Server (FastEthernet0)', 'Internet_Switch (FastEthernet0/1)'],
                ['Internet_Switch (FastEthernet0/2)', 'Cloud (FastEthernet5)'],
                ['Cloud (Coaxial0)', 'Cable Modem (Port 0)'],
              ],
            },
            {
              title: 'Addressing stored in the file',
              headers: ['Device', 'Setting', 'Value'],
              rows: [
                ['Smart devices and tablet', 'Default gateway', '192.168.25.1'],
                ['Internet_Server', 'Address', '200.0.0.1/24, gateway 200.0.0.10'],
              ],
            },
          ],
          architecture: [
            'A cable modem connects the home gateway to an Internet cloud. The cloud also connects to a switch and to a server (Internet_Server, 200.0.0.1/24).',
            'The home gateway is a wireless access point with the SSID HomeGateway. The tablet and the wireless smart devices have HomeGateway set as their SSID.',
            'The smart solar panel is cabled to the home gateway and to the smart battery, and the battery is cabled to the coffee maker and the lamp.',
            'An MCU is cabled to the smart door, the garage door and the smart fan.',
            'The smart devices and the tablet use 192.168.25.1 as their default gateway.',
            'The temperature meter, smoke detector, tablet and Classic Car have no cable in the topology.',
          ],
          approach:
            'A mixture of following the provided requirements and making my own implementation decisions.',
        },
      ],
    },
  ],
};
