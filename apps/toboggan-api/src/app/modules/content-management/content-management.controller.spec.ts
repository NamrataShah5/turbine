import { HttpModule } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { AxiosResponse } from 'axios';
import { of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ContentManagementController } from './content-management.controller';
import { ContentManagementService } from './content-managment.service';

const mockData = [
  {
      "label": "Examine how the humanities influence understanding of one's self-identity",
      "type": "curriculum_pathways",
      "data": {
          "name": "Examine how the humanities influence understanding of one's self-identity",
          "displayName": "Examine how the humanities influence understanding of one's self-identity",
          "description": "Competency 2 Pathway",
          "author": null,
          "alignments": null,
          "references": {
              "competencies": [],
              "skills": []
          },
          "childNodes": {
              "learningExperiences": [
                  "2UZaquiAYqDkduD5ItYp",
                  "6Arqz5xfQZhuhfPmDuYn",
                  "hm6YKFUj0iCxx0jhSvEl",
                  "tD91ZrDvRQJHTsz7H536"
              ],
              "curriculumPathways": []
          },
          "parentNodes": {
              "learningOpportunities": [],
              "curriculumPathways": [
                  {
                      "uuid": "WSis6gkAjgvV9iV247QZ",
                      "name": "HUM102",
                      "displayName": "HUM102",
                      "description": "Cluster A1 Pathway",
                      "author": null,
                      "alignments": null,
                      "references": {},
                      "childNodes": {
                          "curriculumPathways": [
                              "hrrkSiw10TYg9f2cq1zG",
                              "0VPMohg8e7GWDWiIPMp2"
                          ]
                      },
                      "parentNodes": {
                          "curriculumPathways": [
                              "u3y4mNK5lT4tkoD20mXc"
                          ]
                      },
                      "version": 1,
                      "parentVersionUuid": "",
                      "rootVersionUuid": "",
                      "isArchived": false,
                      "isDeleted": false,
                      "metadata": null,
                      "achievements": [
                          "Gq2naQTGpn4fFxjKn4i9",
                          "h8yoPXOR8XWudeyzSZ2M"
                      ],
                      "completionCriteria": null,
                      "prerequisites": {},
                      "isLocked": false,
                      "equivalentCredits": 0,
                      "duration": null,
                      "createdTime": "2023-01-05 08:06:22.139433+00:00",
                      "lastModifiedTime": "2023-01-05 08:06:29.340715+00:00",
                      "createdBy": "",
                      "lastModifiedBy": ""
                  }
              ]
          },
          "metadata": null,
          "achievements": [],
          "completionCriteria": null,
          "prerequisites": {
              "curriculumPathways": [],
              "learningExperiences": [],
              "learningObjects": [],
              "learningResources": [],
              "assessmentItems": [],
              "assessments": []
          },
          "isLocked": false,
          "equivalentCredits": 0,
          "duration": null,
          "uuid": "0VPMohg8e7GWDWiIPMp2",
          "version": 1,
          "isArchived": false,
          "parentVersionUuid": "",
          "rootVersionUuid": "",
          "createdTime": "2023-01-05 08:06:29.244553+00:00",
          "lastModifiedTime": "2023-01-05 08:06:32.726055+00:00",
          "progress": null,
          "status": null,
          "earnedAchievements": null
      },
      "children": [
          {
              "type": "learning_experiences",
              "data": {
                  "uuid": "2UZaquiAYqDkduD5ItYp",
                  "name": "Topic 1",
                  "displayName": "What is self-identity?",
                  "description": "What is self-identity?",
                  "author": null,
                  "alignments": null,
                  "references": {},
                  "parentNodes": {
                      "curriculumPathways": [
                          "0VPMohg8e7GWDWiIPMp2"
                      ]
                  },
                  "version": 1,
                  "parentVersionUuid": "",
                  "rootVersionUuid": "",
                  "isArchived": false,
                  "isDeleted": false,
                  "metadata": null,
                  "achievements": [],
                  "completionCriteria": null,
                  "prerequisites": {},
                  "isLocked": false,
                  "equivalentCredits": 3,
                  "duration": 60,
                  "createdTime": "2023-01-05 08:06:29.373923+00:00",
                  "lastModifiedTime": "2023-01-05 08:06:29.673072+00:00",
                  "createdBy": "",
                  "lastModifiedBy": "",
                  "childNodes": {
                      "learningObjects": [
                          "8rjUzuLMG9zbzEaxqha4"
                      ]
                  }
              },
              "label": "Topic 1",
              "children": [
                  {
                      "type": "learning_objects",
                      "data": {
                          "uuid": "8rjUzuLMG9zbzEaxqha4",
                          "name": "Learning Object Topic 1",
                          "displayName": "What is self-identity?",
                          "description": "What is self-identity?",
                          "author": null,
                          "alignments": null,
                          "references": {
                              "skills": [
                                  {
                                      "uuid": "Etue6vlY8rlqQZ6gBaMx",
                                      "name": "S1",
                                      "description": "Describe the components that comprise self-identity",
                                      "keywords": [],
                                      "author": null,
                                      "creator": null,
                                      "alignments": null,
                                      "organizations": null,
                                      "certifications": null,
                                      "occupations": null,
                                      "onetJob": "",
                                      "type": null,
                                      "parentNodes": {},
                                      "referenceId": null,
                                      "sourceUri": null,
                                      "sourceName": null,
                                      "createdTime": "2023-01-05 08:06:29.524912+00:00",
                                      "lastModifiedTime": "2023-01-05 08:06:29.556943+00:00",
                                      "createdBy": "",
                                      "lastModifiedBy": ""
                                  }
                              ]
                          },
                          "parentNodes": {
                              "learningExperiences": [
                                  "2UZaquiAYqDkduD5ItYp"
                              ]
                          },
                          "version": 1,
                          "parentVersionUuid": "",
                          "rootVersionUuid": "",
                          "isArchived": false,
                          "isDeleted": false,
                          "metadata": null,
                          "achievements": [],
                          "completionCriteria": null,
                          "prerequisites": {},
                          "isLocked": false,
                          "equivalentCredits": 0,
                          "duration": null,
                          "createdTime": "2023-01-05 08:06:29.586170+00:00",
                          "lastModifiedTime": "2023-01-05 08:06:30.472157+00:00",
                          "createdBy": "",
                          "lastModifiedBy": "",
                          "childNodes": {
                              "learningResources": [
                                  "NTfNKJ654GYqc2ibK5Af",
                                  "ECfe86Z7OFKax4a4qEdT",
                                  "AAvO5bhzKMAohAOggk8N",
                                  "mgkk2xaV4Pr5tyzF8q4m",
                                  "PCooCwOKY3veBcVCFZJr"
                              ]
                          }
                      },
                      "label": "Learning Object Topic 1",
                      "children": [
                          {
                              "type": "learning_resources",
                              "data": {
                                  "uuid": "NTfNKJ654GYqc2ibK5Af",
                                  "name": "Core beliefs and identity",
                                  "displayName": null,
                                  "description": "Core beliefs and identity",
                                  "author": null,
                                  "type": "html",
                                  "resourcePath": null,
                                  "ltiContentItemId": null,
                                  "courseCategory": [],
                                  "alignments": {},
                                  "references": {},
                                  "parentNodes": {
                                      "learningObjects": [
                                          "8rjUzuLMG9zbzEaxqha4"
                                      ]
                                  },
                                  "version": 1,
                                  "parentVersionUuid": "",
                                  "rootVersionUuid": "",
                                  "isArchived": false,
                                  "isDeleted": false,
                                  "metadata": {},
                                  "achievements": [],
                                  "completionCriteria": null,
                                  "prerequisites": {},
                                  "isLocked": false,
                                  "createdTime": "2023-01-05 08:06:29.709762+00:00",
                                  "lastModifiedTime": "2023-01-05 08:06:29.747997+00:00",
                                  "createdBy": "",
                                  "lastModifiedBy": ""
                              },
                              "label": "Core beliefs and identity",
                              "children": []
                          },
                          {
                              "type": "assessment_items",
                              "data": {
                                  "uuid": "hBufYE0CngJULheqf20l",
                                  "name": "Formative assessment",
                                  "question": null,
                                  "answer": null,
                                  "context": null,
                                  "options": null,
                                  "questionType": "Multiple Choice Quiz - Knowledge Check",
                                  "activityType": null,
                                  "useType": null,
                                  "metadata": null,
                                  "author": null,
                                  "difficulty": null,
                                  "alignments": null,
                                  "parentNodes": {
                                      "learningObjects": [
                                          "8rjUzuLMG9zbzEaxqha4"
                                      ]
                                  },
                                  "references": null,
                                  "assessmentReference": null,
                                  "achievements": [],
                                  "passThreshold": null,
                                  "isDeleted": false,
                                  "isLocked": true,
                                  "prerequisites": {
                                      "learningResources": [
                                          {
                                              "uuid": "NTfNKJ654GYqc2ibK5Af",
                                              "name": "Core beliefs and identity",
                                              "displayName": null,
                                              "description": "Core beliefs and identity",
                                              "author": null,
                                              "type": "html",
                                              "resourcePath": null,
                                              "ltiContentItemId": null,
                                              "courseCategory": [],
                                              "alignments": {},
                                              "references": {},
                                              "parentNodes": {
                                                  "learningObjects": [
                                                      "8rjUzuLMG9zbzEaxqha4"
                                                  ]
                                              },
                                              "childNodes": {},
                                              "version": 1,
                                              "parentVersionUuid": "",
                                              "rootVersionUuid": "",
                                              "isArchived": false,
                                              "isDeleted": false,
                                              "metadata": {},
                                              "achievements": [],
                                              "completionCriteria": null,
                                              "prerequisites": {},
                                              "isLocked": false,
                                              "createdTime": "2023-01-05 08:06:29.709762+00:00",
                                              "lastModifiedTime": "2023-01-05 08:06:29.747997+00:00",
                                              "createdBy": "",
                                              "lastModifiedBy": ""
                                          }
                                      ]
                                  },
                                  "createdTime": "2023-01-05 08:06:30.383953+00:00",
                                  "lastModifiedTime": "2023-01-05 08:06:30.415924+00:00",
                                  "createdBy": "",
                                  "lastModifiedBy": ""
                              },
                              "label": "Formative assessment",
                              "children": []
                          }
                      ]
                  }
              ]
          }
      ]
  }
];

const mockResponse: AxiosResponse = {
  data: null,
  status: 200,
  statusText: 'OK',
  headers: {},
  config: {},
}

describe('ContentManagementController', () => {
  let controller: ContentManagementController;
  let service: ContentManagementService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        HttpModule.register({
          baseURL: environment.GPCoreBaseUrl + '/learning-object-service/api/v1',
          timeout: 8000,
          maxRedirects: 3,
        }),
      ],
      controllers: [ContentManagementController],
      providers: [ContentManagementService],
    }).compile();

    service = module.get<ContentManagementService>(ContentManagementService);

    controller = module.get<ContentManagementController>(
      ContentManagementController
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should get CurriculmPathway', async () => {
    mockResponse['data'] = mockData;
    const mockCurriculumPathwayId = mockData[0]['data']['uuid'];

    jest
      .spyOn(service, 'getCurriculumPathway')
      .mockImplementation(() => of(mockResponse));

    controller
      .getCurriculumPathway(mockCurriculumPathwayId)
      .subscribe((response) => {
        expect(service.getCurriculumPathway).toHaveBeenCalledWith(
          mockCurriculumPathwayId
        );
        expect(response).toBe(mockResponse);
      });
  });
});
